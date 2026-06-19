/**
 * Wrap an async route handler so rejected promises reach the error handler
 * instead of crashing the process. Use once controllers exist:
 *   router.get('/', asyncHandler(controller.list));
 */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
