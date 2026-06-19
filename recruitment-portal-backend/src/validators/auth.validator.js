const { z } = require('zod');

const { OTP_PURPOSE } = require('../constants');

const email = z.string().trim().toLowerCase().email('Please provide a valid email');
const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long');
const sixDigitCode = z.string().regex(/^\d{6}$/, 'Code must be 6 digits');

const registerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1, 'First name is required').max(60),
    lastName: z.string().trim().min(1, 'Last name is required').max(60),
    email,
    phone: z.string().trim().min(7).max(20).optional(),
    password: strongPassword,
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email,
    code: sixDigitCode,
    purpose: z.nativeEnum(OTP_PURPOSE).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, 'Password is required'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({ email }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    email,
    code: sixDigitCode,
    password: strongPassword,
  }),
});

const deleteAccountSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required'),
  }),
});

const optionalStr = (max = 200) => z.string().trim().max(max).optional();

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1).max(60).optional(),
    lastName: z.string().trim().min(1).max(60).optional(),
    phone: z.string().trim().max(20).optional().or(z.literal('')),
    headline: optionalStr(120),
    location: optionalStr(),
    avatarUrl: optionalStr(500),
    about: optionalStr(2000),
    dateOfBirth: optionalStr(40),
    gender: optionalStr(40),
    currentCompany: optionalStr(),
    noticePeriod: optionalStr(40),
    expectedSalary: optionalStr(40),
    preferredLocation: optionalStr(),
    social: z
      .object({
        linkedin: optionalStr(300),
        github: optionalStr(300),
        portfolio: optionalStr(300),
        twitter: optionalStr(300),
      })
      .optional(),
    skills: z.array(z.string().trim().max(60)).max(50).optional(),
    experience: z
      .array(
        z.object({
          title: optionalStr(120),
          company: optionalStr(120),
          start: optionalStr(40),
          end: optionalStr(40),
          description: optionalStr(1000),
        }),
      )
      .max(30)
      .optional(),
    education: z
      .array(
        z.object({
          school: optionalStr(160),
          degree: optionalStr(160),
          start: optionalStr(40),
          end: optionalStr(40),
        }),
      )
      .max(30)
      .optional(),
    projects: z
      .array(
        z.object({
          name: optionalStr(160),
          link: optionalStr(300),
          description: optionalStr(1000),
        }),
      )
      .max(30)
      .optional(),
    certifications: z
      .array(z.object({ name: optionalStr(160), issuer: optionalStr(160), year: optionalStr(20) }))
      .max(30)
      .optional(),
    languages: z
      .array(z.object({ name: optionalStr(80), proficiency: optionalStr(40) }))
      .max(30)
      .optional(),
  }),
});

module.exports = {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
};
