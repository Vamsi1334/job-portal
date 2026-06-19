const ApiError = require('../utils/ApiError');

/**
 * Catch-all for unmatched routes. Runs before the global error handler.
 */
function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
