/**
 * Soft delete plugin.
 *
 * Adds a nullable `deletedAt` timestamp and keeps soft-deleted documents out of
 * normal queries. To include them, pass the `withDeleted` query option:
 *
 *   Model.find().setOptions({ withDeleted: true });
 *   Model.findWithDeleted();
 *
 * Instance helpers: doc.softDelete(), doc.restore().
 * Static helpers: Model.findWithDeleted(filter), Model.softDeleteById(id).
 */
const FIND_HOOKS = [
  'count',
  'countDocuments',
  'find',
  'findOne',
  'findOneAndUpdate',
  'findOneAndDelete',
  'updateOne',
  'updateMany',
];

module.exports = function softDeletePlugin(schema) {
  schema.add({ deletedAt: { type: Date, default: null } });
  schema.index({ deletedAt: 1 });

  FIND_HOOKS.forEach((hook) => {
    schema.pre(hook, function applyNotDeleted(next) {
      const opts = typeof this.getOptions === 'function' ? this.getOptions() : {};
      if (opts.withDeleted) return next();

      const filter = typeof this.getFilter === 'function' ? this.getFilter() : {};
      if (filter.deletedAt === undefined) {
        this.where({ deletedAt: null });
      }
      return next();
    });
  });

  schema.methods.softDelete = function softDelete() {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function restore() {
    this.deletedAt = null;
    return this.save();
  };

  schema.statics.findWithDeleted = function findWithDeleted(filter = {}) {
    return this.find(filter).setOptions({ withDeleted: true });
  };

  schema.statics.softDeleteById = function softDeleteById(id) {
    return this.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  };
};
