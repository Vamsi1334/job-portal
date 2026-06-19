const mongoose = require('mongoose');

const { sha256 } = require('../utils/crypto');
const toJSON = require('./plugins/toJSON');
const softDelete = require('./plugins/softDelete');

const refreshTokenSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', index: true },
    // Store the hash of the token, never the raw token.
    tokenHash: { type: String, required: true, unique: true, private: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    // Hash of the token that replaced this one, for rotation auditing.
    replacedByToken: { type: String, default: null },
    createdByIp: { type: String, trim: true },
    revokedByIp: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true },
);

refreshTokenSchema.plugin(toJSON);
refreshTokenSchema.plugin(softDelete);

// `unique: true` on tokenHash already creates the index.
// TTL index: expired tokens drop out of the collection.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.statics.hashToken = function hashToken(rawToken) {
  return sha256(rawToken);
};

refreshTokenSchema.statics.findByRawToken = function findByRawToken(rawToken) {
  return this.findOne({ tokenHash: sha256(rawToken) });
};

refreshTokenSchema.methods.isExpired = function isExpired() {
  return this.expiresAt.getTime() <= Date.now();
};

refreshTokenSchema.methods.isActive = function isActive() {
  return this.revokedAt === null && !this.isExpired();
};

refreshTokenSchema.methods.revoke = function revoke(ip, replacedByToken = null) {
  this.revokedAt = new Date();
  if (ip) this.revokedByIp = ip;
  if (replacedByToken) this.replacedByToken = replacedByToken;
  return this.save();
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
