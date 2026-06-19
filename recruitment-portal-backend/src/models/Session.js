const mongoose = require('mongoose');

const toJSON = require('./plugins/toJSON');
const softDelete = require('./plugins/softDelete');

const sessionSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    userAgent: { type: String, trim: true },
    ip: { type: String, trim: true },
    device: { type: String, trim: true },
    location: { type: String, trim: true },
    lastActiveAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

sessionSchema.plugin(toJSON);
sessionSchema.plugin(softDelete);

// TTL index: expired sessions are cleaned up automatically.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ employee: 1, revokedAt: 1 });

sessionSchema.methods.isActive = function isActive() {
  return this.revokedAt === null && this.expiresAt.getTime() > Date.now();
};

sessionSchema.methods.revoke = function revoke() {
  this.revokedAt = new Date();
  return this.save();
};

sessionSchema.methods.touch = function touch() {
  this.lastActiveAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Session', sessionSchema);
