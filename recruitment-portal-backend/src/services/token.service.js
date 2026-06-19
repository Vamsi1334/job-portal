const { env, isProd } = require('../config/env');
const { signToken } = require('../utils/jwt');
const { randomToken, sha256 } = require('../utils/crypto');
const { Employee, RefreshToken, Session } = require('../models');
const { TOKEN_COOKIE } = require('../constants');
const ApiError = require('../utils/ApiError');

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_PATH = '/api/v1/auth';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function refreshExpiry() {
  return new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * MS_PER_DAY);
}

/**
 * Cookie flags. In production cookies are Secure and SameSite=None so the
 * separate frontend origin can send them over https. In development we relax to
 * Lax over http for convenience.
 */
function accessCookieOptions() {
  return { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', path: '/' };
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: REFRESH_PATH,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * MS_PER_DAY,
  };
}

function signAccessToken(employee) {
  const id = employee.id || employee._id.toString();
  return signToken({ id, role: employee.role });
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(TOKEN_COOKIE, accessToken, accessCookieOptions());
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
}

function clearAuthCookies(res) {
  res.clearCookie(TOKEN_COOKIE, { path: '/' });
  res.clearCookie(REFRESH_COOKIE, { path: REFRESH_PATH });
}

/**
 * Create a session and a first refresh token, return both tokens.
 */
async function issueSessionTokens(employee, req) {
  const session = await Session.create({
    employee: employee._id,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    expiresAt: refreshExpiry(),
  });

  const raw = randomToken();
  await RefreshToken.create({
    employee: employee._id,
    session: session._id,
    tokenHash: sha256(raw),
    expiresAt: refreshExpiry(),
    createdByIp: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return { accessToken: signAccessToken(employee), refreshToken: raw, session };
}

/**
 * Rotate a refresh token. Detects reuse of an already-revoked token and, if
 * found, revokes every active token and session for that account.
 */
async function rotateRefreshToken(rawToken, req) {
  const existing = await RefreshToken.findByRawToken(rawToken);
  if (!existing) throw ApiError.unauthorized('Invalid refresh token');

  if (!existing.isActive()) {
    if (existing.revokedAt) {
      await revokeAllForEmployee(existing.employee);
    }
    throw ApiError.unauthorized('Refresh token is no longer valid');
  }

  const employee = await Employee.findById(existing.employee);
  if (!employee) throw ApiError.unauthorized('Account not found');

  const raw = randomToken();
  await RefreshToken.create({
    employee: employee._id,
    session: existing.session,
    tokenHash: sha256(raw),
    expiresAt: refreshExpiry(),
    createdByIp: req.ip,
    userAgent: req.headers['user-agent'],
  });

  await existing.revoke(req.ip, sha256(raw));
  if (existing.session) {
    await Session.findByIdAndUpdate(existing.session, { lastActiveAt: new Date() });
  }

  return { accessToken: signAccessToken(employee), refreshToken: raw, employee };
}

/**
 * Revoke a single refresh token (and its session) by its raw value.
 */
async function revokeByRawToken(rawToken, ip) {
  const existing = await RefreshToken.findByRawToken(rawToken);
  if (existing && existing.isActive()) {
    await existing.revoke(ip);
    if (existing.session) {
      await Session.findByIdAndUpdate(existing.session, { revokedAt: new Date() });
    }
  }
}

/**
 * Revoke every active token and session for an account (logout everywhere).
 */
async function revokeAllForEmployee(employeeId) {
  const now = new Date();
  await RefreshToken.updateMany({ employee: employeeId, revokedAt: null }, { revokedAt: now });
  await Session.updateMany({ employee: employeeId, revokedAt: null }, { revokedAt: now });
}

module.exports = {
  REFRESH_COOKIE,
  setAuthCookies,
  clearAuthCookies,
  signAccessToken,
  issueSessionTokens,
  rotateRefreshToken,
  revokeByRawToken,
  revokeAllForEmployee,
};
