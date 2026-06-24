import { api } from './client';

export interface RegisterPayload {
  email?: string;
  phone?: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', payload, { skipAuth: true });
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  return api.post<ForgotPasswordResponse>('/auth/forgot-password', payload, { skipAuth: true });
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<ResetPasswordResponse> {
  return api.post<ResetPasswordResponse>('/auth/reset-password', payload, { skipAuth: true });
}
