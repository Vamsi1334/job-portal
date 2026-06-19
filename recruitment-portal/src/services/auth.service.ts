import { apiClient } from '@/lib/axios';
import type { AuthUser, UpdateProfilePayload } from '@/types';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
}

interface AuthSession {
  employee: AuthUser;
  accessToken: string;
}

/**
 * Every auth network call lives here. Hooks and components never touch the API
 * client directly, so endpoints and response shapes stay in one place.
 */
export const authService = {
  async register(payload: RegisterPayload): Promise<{ employee: AuthUser; devCode?: string }> {
    const { data } = await apiClient.post('/auth/register', payload);
    return { employee: data.data.employee, devCode: data.devCode };
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthSession> {
    const { data } = await apiClient.post('/auth/verify-otp', payload);
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    const { data } = await apiClient.post('/auth/login', payload);
    return data.data;
  },

  async refresh(): Promise<{ accessToken: string }> {
    const { data } = await apiClient.post('/auth/refresh');
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(email: string): Promise<{ devCode?: string }> {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return { devCode: data.devCode };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await apiClient.post('/auth/reset-password', payload);
  },

  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete('/auth/account', { data: { password } });
  },

  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get('/auth/me');
    return data.data.employee;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const { data } = await apiClient.patch('/auth/me', payload);
    return data.data.employee;
  },
};
