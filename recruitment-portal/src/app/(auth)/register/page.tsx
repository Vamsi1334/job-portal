import type { Metadata } from 'next';

import { RegisterForm } from '@/components/forms/register-form';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Recruitment Portal account.',
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          It takes a minute. We will email you a code to verify it.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
