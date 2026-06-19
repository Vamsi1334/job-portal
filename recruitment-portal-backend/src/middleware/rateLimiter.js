const rateLimit = require('express-rate-limit');

const { env, isTest } = require('../config/env');

// Disable limiting under automated tests so suites stay deterministic.
const skip = () => isTest;

/**
 * Default limiter for the whole API surface.
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { status: 'fail', message: 'Too many requests, please try again later.' },
});

/**
 * Stricter limiter for sensitive endpoints (login, register, reset, and so on).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { status: 'fail', message: 'Too many attempts, please try again later.' },
});

module.exports = { apiLimiter, authLimiter };
