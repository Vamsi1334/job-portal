const { Employee, Otp, AuditLog } = require('../models');
const ApiError = require('../utils/ApiError');
const { env, isProd } = require('../config/env');
const { randomOtp } = require('../utils/crypto');
const { OTP_PURPOSE, OTP_CHANNEL, EMPLOYEE_STATUS, AUDIT_STATUS } = require('../constants');
const logger = require('../utils/logger');
const tokenService = require('./token.service');

const otpExpiry = () => new Date(Date.now() + env.OTP_TTL_MINUTES * 60 * 1000);
const normalize = (email) => String(email).toLowerCase().trim();

/**
 * Write an audit record. Never let auditing break the main flow.
 */
async function audit(action, { actor = null, status = AUDIT_STATUS.SUCCESS, req, message, entityId } = {}) {
  try {
    await AuditLog.create({
      actor,
      action,
      status,
      message,
      entityType: 'Employee',
      entityId,
      ip: req && req.ip,
      userAgent: req && req.headers['user-agent'],
    });
  } catch (err) {
    logger.error(`Audit write failed: ${err.message}`);
  }
}

/**
 * Invalidate any outstanding codes, then create and "send" a fresh one. There
 * is no email or SMS provider wired up, so the code is logged. In non-production
 * it is also returned to the caller to make manual testing easy.
 */
async function issueOtp(employee, identifier, purpose, channel = OTP_CHANNEL.EMAIL) {
  await Otp.updateMany({ identifier, purpose, consumedAt: null }, { consumedAt: new Date() });

  const code = randomOtp(6);
  await Otp.create({
    employee: employee ? employee._id : undefined,
    identifier,
    codeHash: await Otp.hashCode(code),
    channel,
    purpose,
    expiresAt: otpExpiry(),
  });

  logger.info(`OTP for ${identifier} (${purpose}): ${code}`);
  return code;
}

/**
 * Find the newest still-usable OTP and verify the supplied code. Increments the
 * attempt counter on a wrong code, consumes it on success.
 */
async function consumeOtp(identifier, code, purpose) {
  const otp = await Otp.findOne({ identifier, purpose, consumedAt: null })
    .select('+codeHash')
    .sort({ createdAt: -1 });

  if (!otp) throw ApiError.badRequest('No active code found. Please request a new one.');
  if (otp.isExpired()) throw ApiError.badRequest('Code has expired. Please request a new one.');
  if (otp.attempts >= otp.maxAttempts) {
    throw ApiError.badRequest('Too many attempts. Please request a new code.');
  }

  const ok = await otp.verifyCode(code);
  if (!ok) {
    otp.attempts += 1;
    await otp.save();
    throw ApiError.badRequest('Invalid code');
  }

  otp.consumedAt = new Date();
  await otp.save();
  return otp;
}

async function register(input, req) {
  const email = normalize(input.email);
  const existing = await Employee.findByEmail(email);
  if (existing) throw ApiError.conflict('An account with that email already exists');

  const verify = env.REQUIRE_EMAIL_VERIFICATION;

  const employee = await Employee.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email,
    phone: input.phone,
    password: input.password,
    status: verify ? EMPLOYEE_STATUS.PENDING : EMPLOYEE_STATUS.ACTIVE,
    isEmailVerified: !verify,
  });

  await audit('auth.register', { actor: employee._id, req, entityId: employee._id });

  // Email verification disabled: the account is active and verified, but the
  // user is NOT auto-logged-in. They get a success message and sign in next.
  if (!verify) {
    return { employee };
  }

  const code = await issueOtp(employee, email, OTP_PURPOSE.VERIFY_EMAIL);
  return { employee, devCode: isProd ? undefined : code };
}

async function verifyOtp(input, req) {
  const email = normalize(input.email);
  const purpose = input.purpose || OTP_PURPOSE.VERIFY_EMAIL;

  await consumeOtp(email, input.code, purpose);

  const employee = await Employee.findByEmail(email);
  if (!employee) throw ApiError.notFound('Account not found');

  if (purpose === OTP_PURPOSE.VERIFY_EMAIL) {
    employee.isEmailVerified = true;
    employee.status = EMPLOYEE_STATUS.ACTIVE;
  }
  employee.lastLoginAt = new Date();
  await employee.save();

  await audit('auth.verify_otp', { actor: employee._id, req, entityId: employee._id });

  const tokens = await tokenService.issueSessionTokens(employee, req);
  return { employee, tokens };
}

async function login(input, req) {
  const email = normalize(input.email);
  const employee = await Employee.findOne({ email }).select('+password');

  // Use the same error for unknown email and wrong password to avoid leaking
  // which accounts exist.
  if (!employee) {
    await audit('auth.login', { status: AUDIT_STATUS.FAILURE, req, message: 'unknown email' });
    throw ApiError.unauthorized('Invalid email or password');
  }

  const ok = await employee.comparePassword(input.password);
  if (!ok) {
    await audit('auth.login', {
      actor: employee._id,
      status: AUDIT_STATUS.FAILURE,
      req,
      message: 'bad password',
      entityId: employee._id,
    });
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (env.REQUIRE_EMAIL_VERIFICATION && !employee.isEmailVerified) {
    throw ApiError.forbidden('Please verify your email before logging in');
  }
  if (employee.status === EMPLOYEE_STATUS.SUSPENDED) throw ApiError.forbidden('Your account is suspended');

  employee.lastLoginAt = new Date();
  await employee.save();

  const tokens = await tokenService.issueSessionTokens(employee, req);
  await audit('auth.login', { actor: employee._id, req, entityId: employee._id });

  return { employee, tokens };
}

async function refresh(rawToken, req) {
  if (!rawToken) throw ApiError.unauthorized('Refresh token missing');
  return tokenService.rotateRefreshToken(rawToken, req);
}

async function logout(rawToken, req) {
  if (rawToken) await tokenService.revokeByRawToken(rawToken, req.ip);
  await audit('auth.logout', { req });
}

async function forgotPassword(input, req) {
  const email = normalize(input.email);
  const employee = await Employee.findByEmail(email);

  // Respond the same whether or not the account exists.
  if (!employee) {
    await audit('auth.forgot_password', { status: AUDIT_STATUS.FAILURE, req, message: 'unknown email' });
    return { devCode: undefined };
  }

  const code = await issueOtp(employee, email, OTP_PURPOSE.RESET_PASSWORD);
  await audit('auth.forgot_password', { actor: employee._id, req, entityId: employee._id });
  return { devCode: isProd ? undefined : code };
}

async function resetPassword(input, req) {
  const email = normalize(input.email);
  await consumeOtp(email, input.code, OTP_PURPOSE.RESET_PASSWORD);

  const employee = await Employee.findByEmail(email);
  if (!employee) throw ApiError.notFound('Account not found');

  employee.password = input.password; // hashed by the pre-save hook
  await employee.save();

  // Force re-login everywhere after a password change.
  await tokenService.revokeAllForEmployee(employee._id);
  await audit('auth.reset_password', { actor: employee._id, req, entityId: employee._id });
}

const PROFILE_FIELDS = [
  'firstName',
  'lastName',
  'phone',
  'headline',
  'location',
  'avatarUrl',
  'about',
  'dateOfBirth',
  'gender',
  'currentCompany',
  'noticePeriod',
  'expectedSalary',
  'preferredLocation',
  'social',
  'skills',
  'experience',
  'education',
  'projects',
  'certifications',
  'languages',
];

async function updateProfile(employeeId, input, req) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw ApiError.notFound('Account not found');

  for (const field of PROFILE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      employee[field] = input[field];
    }
  }

  await employee.save();
  await audit('auth.update_profile', { actor: employee._id, req, entityId: employee._id });
  return employee;
}

async function deleteAccount(employeeId, password, req) {
  const employee = await Employee.findById(employeeId).select('+password');
  if (!employee) throw ApiError.notFound('Account not found');

  const ok = await employee.comparePassword(password);
  if (!ok) throw ApiError.unauthorized('Password is incorrect');

  await employee.softDelete();
  await tokenService.revokeAllForEmployee(employee._id);
  await audit('auth.delete_account', { actor: employee._id, req, entityId: employee._id });
}

module.exports = {
  register,
  verifyOtp,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  deleteAccount,
  issueOtp,
};
