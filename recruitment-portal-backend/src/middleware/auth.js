const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const { TOKEN_COOKIE } = require('../constants');

/**
 * Read a JWT from the access_token cookie or an Authorization Bearer header.
 */
function extractToken(req) {
  if (req.cookies && req.cookies[TOKEN_COOKIE]) return req.cookies[TOKEN_COOKIE];
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

/**
 * Require a valid token. Attaches the decoded payload to req.user.
 *
 * Note: this verifies the token only. Once a User model exists, look the user
 * up here and reject if the account is missing or disabled.
 */
function protect(req, _res, next) {
  const token = extractToken(req);
  if (!token) return next(new ApiError(401, 'Authentication required'));

  try {
    req.user = verifyToken(token);
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Restrict a route to specific roles. Use after protect:
 *   router.delete('/:id', protect, restrictTo('admin'), controller.remove);
 */
const restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    return next();
  };

module.exports = { protect, restrictTo, extractToken };
