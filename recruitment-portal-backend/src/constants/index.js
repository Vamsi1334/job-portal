/**
 * Shared constants. Reference these instead of magic strings or numbers.
 */
const ROLES = Object.freeze({
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
});

const EMPLOYEE_STATUS = Object.freeze({
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
});

const OTP_PURPOSE = Object.freeze({
  VERIFY_EMAIL: 'verify_email',
  LOGIN: 'login',
  RESET_PASSWORD: 'reset_password',
});

const OTP_CHANNEL = Object.freeze({
  EMAIL: 'email',
  SMS: 'sms',
});

const AUDIT_STATUS = Object.freeze({
  SUCCESS: 'success',
  FAILURE: 'failure',
});

const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

const TOKEN_COOKIE = 'access_token';

module.exports = {
  ROLES,
  EMPLOYEE_STATUS,
  OTP_PURPOSE,
  OTP_CHANNEL,
  AUDIT_STATUS,
  HTTP_STATUS,
  TOKEN_COOKIE,
};
