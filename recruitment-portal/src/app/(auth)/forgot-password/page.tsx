import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your Recruitment Portal password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send a code to reset it.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
