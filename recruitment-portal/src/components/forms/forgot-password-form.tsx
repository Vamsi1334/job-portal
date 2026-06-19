'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas/auth';
import type { ApiError } from '@/lib/axios';
import { useForgotPassword } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormStatus } from '@/components/common/form-status';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | undefined>(undefined);
  const forgot = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null);
    try {
      const result = await forgot.mutateAsync(values.email);
      setSentTo(values.email);
      setDevCode(result.devCode);
    } catch (err) {
      setError((err as ApiError).message);
    }
  };

  const isSubmitting = forgot.isPending;

  if (sentTo) {
    return (
      <div className="space-y-6">
        <FormStatus
          variant="success"
          message="If an account exists for that email, a reset code is on its way."
        />
        {devCode ? (
          <p className="rounded-md border border-dashed border-border px-3 py-2 text-center font-mono text-sm">
            Dev code: {devCode}
          </p>
        ) : null}
        <Button asChild className="w-full">
          <Link href={`/reset-password?email=${encodeURIComponent(sentTo)}`}>
            Enter reset code
          </Link>
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <FormStatus variant="error" message={error} /> : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Sending code
              </>
            ) : (
              'Send reset code'
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
