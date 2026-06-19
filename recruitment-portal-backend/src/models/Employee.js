const mongoose = require('mongoose');

const { hashPassword, comparePassword } = require('../utils/password');
const { ROLES, EMPLOYEE_STATUS } = require('../constants');
const toJSON = require('./plugins/toJSON');
const softDelete = require('./plugins/softDelete');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
      private: true,
    },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CANDIDATE,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(EMPLOYEE_STATUS),
      default: EMPLOYEE_STATUS.ACTIVE,
      index: true,
    },
    isEmailVerified: { type: Boolean, default: false },

    // ---- Profile ----
    headline: { type: String, trim: true, maxlength: 120 },
    location: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    about: { type: String, trim: true, maxlength: 2000 },
    dateOfBirth: { type: String, trim: true },
    gender: { type: String, trim: true },

    // Career details
    currentCompany: { type: String, trim: true },
    noticePeriod: { type: String, trim: true },
    expectedSalary: { type: String, trim: true },
    preferredLocation: { type: String, trim: true },

    // Social links
    social: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      portfolio: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },

    skills: { type: [String], default: [] },

    experience: {
      type: [
        {
          _id: false,
          title: String,
          company: String,
          start: String,
          end: String,
          description: String,
        },
      ],
      default: [],
    },
    education: {
      type: [{ _id: false, school: String, degree: String, start: String, end: String }],
      default: [],
    },
    projects: {
      type: [{ _id: false, name: String, link: String, description: String }],
      default: [],
    },
    certifications: {
      type: [{ _id: false, name: String, issuer: String, year: String }],
      default: [],
    },
    languages: {
      type: [{ _id: false, name: String, proficiency: String }],
      default: [],
    },

    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

employeeSchema.plugin(toJSON);
employeeSchema.plugin(softDelete);

// `unique: true` on email already creates the unique index. Add others here.
employeeSchema.index({ createdAt: -1 });

employeeSchema.virtual('fullName').get(function getFullName() {
  return [this.firstName, this.lastName].filter(Boolean).join(' ');
});

// Hash the password whenever it is set or changed.
employeeSchema.pre('save', async function hashOnSave(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await hashPassword(this.password);
    return next();
  } catch (err) {
    return next(err);
  }
});

employeeSchema.methods.comparePassword = function compare(candidate) {
  return comparePassword(candidate, this.password);
};

employeeSchema.statics.findByEmail = function findByEmail(email) {
  return this.findOne({ email: String(email).toLowerCase().trim() });
};

module.exports = mongoose.model('Employee', employeeSchema);
