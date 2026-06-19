const ApiError = require('../utils/ApiError');

/**
 * Validate a request against a Zod schema shaped as
 * { body?, query?, params? }. On success the parsed values replace the
 * originals so handlers receive typed, sanitized input.
 *
 *   router.post('/', validate(createUserSchema), controller.create);
 */
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    }));
    return next(new ApiError(400, 'Validation failed', details));
  }

  if (result.data.body) req.body = result.data.body;
  if (result.data.query) req.query = result.data.query;
  if (result.data.params) req.params = result.data.params;
  return next();
};

module.exports = validate;
