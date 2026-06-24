// src/api/auth.ts
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
    // skipAuth: true because there's no token yet at registration time
    return api.post<AuthResponse>('/auth/register', payload, { skipAuth: true });
}