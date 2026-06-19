import { Suspense } from 'react';
import type { Metadata } from 'next';

import { LoginForm } from '@/components/forms/login-form';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Recruitment Portal account.',
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">Sign in to continue your job search.</p>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
