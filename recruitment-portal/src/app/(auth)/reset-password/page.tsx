import { Suspense } from 'react';
import type { Metadata } from 'next';

import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Set a new password for your account.',
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Set a new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the code from your email and choose a new password.
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
