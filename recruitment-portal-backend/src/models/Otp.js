const mongoose = require('mongoose');

const { hashPassword, comparePassword } = require('../utils/password');
const { OTP_PURPOSE, OTP_CHANNEL } = require('../constants');
const toJSON = require('./plugins/toJSON');
const softDelete = require('./plugins/softDelete');

const otpSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', index: true },
    // Email or phone the code was sent to.
    identifier: { type: String, required: true, lowercase: true, trim: true },
    // The code is stored hashed, never in plain text.
    codeHash: { type: String, required: true, select: false, private: true },
    channel: { type: String, enum: Object.values(OTP_CHANNEL), required: true },
    purpose: { type: String, enum: Object.values(OTP_PURPOSE), required: true },
    attempts: { type: Number, default: 0, min: 0 },
    maxAttempts: { type: Number, default: 5, min: 1 },
    consumedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

otpSchema.plugin(toJSON);
otpSchema.plugin(softDelete);

// Look up the active code for a given target and purpose.
otpSchema.index({ identifier: 1, purpose: 1 });
// TTL index: MongoDB removes the document once expiresAt passes.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash a plain code before saving. bcrypt is used because OTPs are low entropy.
otpSchema.statics.hashCode = function hashCode(code) {
  return hashPassword(String(code));
};

otpSchema.methods.verifyCode = function verifyCode(code) {
  return comparePassword(String(code), this.codeHash);
};

otpSchema.methods.isExpired = function isExpired() {
  return this.expiresAt.getTime() <= Date.now();
};

otpSchema.methods.isConsumed = function isConsumed() {
  return this.consumedAt !== null;
};

otpSchema.methods.isUsable = function isUsable() {
  return !this.isConsumed() && !this.isExpired() && this.attempts < this.maxAttempts;
};

module.exports = mongoose.model('Otp', otpSchema);
