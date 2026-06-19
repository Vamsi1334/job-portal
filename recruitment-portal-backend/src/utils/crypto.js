const crypto = require('crypto');

/**
 * Fast one-way hash for high entropy secrets such as refresh tokens. Never use
 * this for passwords (use utils/password and bcrypt for those).
 */
function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

/**
 * Cryptographically strong random token, hex encoded.
 */
function randomToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Numeric one time passcode of the given length, zero padded.
 */
function randomOtp(digits = 6) {
  const code = crypto.randomInt(0, 10 ** digits);
  return String(code).padStart(digits, '0');
}

module.exports = { sha256, randomToken, randomOtp };
