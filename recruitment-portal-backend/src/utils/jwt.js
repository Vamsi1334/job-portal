const jwt = require('jsonwebtoken');

const { env } = require('../config/env');

/**
 * Sign a short-lived access token. Default expiry comes from ACCESS_TOKEN_TTL.
 */
function signToken(payload, options = {}) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL, ...options });
}

/**
 * Verify and decode a token. Throws on invalid or expired tokens, which the
 * global error handler maps to 401.
 */
function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
