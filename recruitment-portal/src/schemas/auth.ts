import { z } from 'zod';

const email = z.string().min(1, 'Email is required').email('Enter a valid email address');
const password = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters');
const code = z
  .string()
  .min(1, 'Code is required')
  .regex(/^\d{6}$/, 'Enter the 6 digit code');

export const loginSchema = z.object({
  email,
  password,
  rememberMe: z.boolean().default(false),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(60),
    lastName: z.string().min(1, 'Last name is required').max(60),
    email,
    phone: z
      .string()
      .regex(/^[0-9+\-\s()]{7,20}$/, 'Enter a valid phone number')
      .optional()
      .or(z.literal('')),
    password,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: 'Please accept the terms to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
  email,
  code,
});
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email,
    code,
    password,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
