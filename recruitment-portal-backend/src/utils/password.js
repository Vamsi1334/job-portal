const bcrypt = require('bcrypt');

const { env } = require('../config/env');

/**
 * Hash a plain text password. Salt rounds come from BCRYPT_SALT_ROUNDS.
 */
function hashPassword(plain) {
  return bcrypt.hash(plain, env.BCRYPT_SALT_ROUNDS);
}

/**
 * Compare a plain text password against a stored hash.
 */
function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, comparePassword };
