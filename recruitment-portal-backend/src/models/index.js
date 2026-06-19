/**
 * Model barrel. Import models from one place:
 *   const { Employee, RefreshToken } = require('./models');
 */
const Employee = require('./Employee');
const Otp = require('./Otp');
const Session = require('./Session');
const RefreshToken = require('./RefreshToken');
const AuditLog = require('./AuditLog');

module.exports = { Employee, Otp, Session, RefreshToken, AuditLog };
