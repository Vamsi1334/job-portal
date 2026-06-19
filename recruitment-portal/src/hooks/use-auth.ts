import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
  type VerifyOtpPayload,
} from '@/services/auth.service';
import type { AuthUser, UpdateProfilePayload } from '@/types';

/**
 * Current user. Returns 401 (and an error state) when not signed in. retry is
 * off so a logged-out visitor does not hammer the endpoint.
 */
export function useMe() {
  return useQuery<AuthUser>({
    queryKey: queryKeys.auth.me,
    queryFn: authService.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.me, session.employee);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.auth.me, session.employee);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => authService.updateProfile(payload),
    onSuccess: (employee) => {
      queryClient.setQueryData(queryKeys.auth.me, employee);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (password: string) => authService.deleteAccount(password),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
    },
  });
}
