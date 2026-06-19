const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { isProd } = require('../config/env');

/**
 * Convert framework and driver errors into a consistent ApiError.
 */
function normalize(err) {
  if (err instanceof ApiError) return err;

  // Mongoose: bad ObjectId or cast failure.
  if (err.name === 'CastError') {
    return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }
  // Mongo: duplicate key.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new ApiError(409, `A record with that ${field} already exists`);
  }
  // Mongoose: schema validation.
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
    return new ApiError(400, 'Validation failed', details);
  }
  // JWT.
  if (err.name === 'JsonWebTokenError') return new ApiError(401, 'Invalid token');
  if (err.name === 'TokenExpiredError') return new ApiError(401, 'Token expired');

  // Unknown: treat as non-operational server error.
  return new ApiError(err.statusCode || 500, err.message || 'Internal server error', undefined, false);
}

// Express identifies error handlers by their four arguments.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const error = normalize(err);

  if (error.statusCode >= 500 || !error.isOperational) {
    logger.error(`${req.method} ${req.originalUrl} -> ${error.message}`);
    logger.error(err.stack || '');
  }

  const body = { status: error.status, message: error.message };
  if (error.details) body.details = error.details;
  if (!isProd) body.stack = err.stack;

  res.status(error.statusCode).json(body);
}

module.exports = errorHandler;
