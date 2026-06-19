/**
 * toJSON plugin.
 *
 * Cleans up the object returned by JSON.stringify and res.json:
 *   - removes any path marked with `private: true` (for example password hashes)
 *   - replaces `_id` with `id`
 *   - removes `__v`
 *   - includes virtuals
 *
 * Preserves any transform already defined on the schema.
 */
const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (obj[path[index]] == null) return;
  deleteAtPath(obj[path[index]], path, index + 1);
};

module.exports = function toJSONPlugin(schema) {
  let existingTransform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    existingTransform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    virtuals: true,
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      if (ret._id !== undefined) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      delete ret.__v;

      if (existingTransform) {
        return existingTransform(doc, ret, options);
      }
      return ret;
    },
  });
};
