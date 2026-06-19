const mongoose = require('mongoose');

const { AUDIT_STATUS } = require('../constants');
const toJSON = require('./plugins/toJSON');
const softDelete = require('./plugins/softDelete');

const auditLogSchema = new mongoose.Schema(
  {
    // The employee who performed the action. null means a system action.
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
      index: true,
    },
    action: { type: String, required: true, trim: true, index: true },
    // The thing acted on, for example "Employee" / its id.
    entityType: { type: String, trim: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    status: {
      type: String,
      enum: Object.values(AUDIT_STATUS),
      default: AUDIT_STATUS.SUCCESS,
    },
    message: { type: String, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

auditLogSchema.plugin(toJSON);
auditLogSchema.plugin(softDelete);

// Common access patterns: by actor over time, and by action over time.
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });

// Audit logs are append-only. Block updates at the model level.
auditLogSchema.pre('findOneAndUpdate', function blockUpdate(next) {
  next(new Error('Audit logs are immutable and cannot be updated'));
});

auditLogSchema.statics.record = function record(entry) {
  return this.create(entry);
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
