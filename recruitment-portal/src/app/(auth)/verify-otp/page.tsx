import { Suspense } from 'react';
import type { Metadata } from 'next';

import { VerifyOtpForm } from '@/components/forms/verify-otp-form';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export const metadata: Metadata = {
  title: 'Verify email',
  description: 'Enter the code we sent to verify your email.',
};

export default function VerifyOtpPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6 digit code we sent you to activate your account.
        </p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
