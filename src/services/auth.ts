import axios from 'axios';
import { api, unwrap } from './api';
import type { User } from '../types/entities';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const res = await api.post<{ success: boolean; data: { token: string; user: User } }>('/auth/login', credentials);
  const data = unwrap(res) as { token: string; user: User };
  if (!data.token || !data.user) {
    throw new Error('Login failed');
  }
  return { ...data, success: true };
}

/** Register with email + password. Backend creates an org and returns token; we return the same shape as login for auto-login. */
export async function register(data: RegisterData): Promise<LoginResponse> {
  try {
    const res = await api.post<{ success: boolean; data: { token: string; user: User } }>('/auth/register', data);
    const payload = unwrap(res) as { token: string; user: User };
    if (!payload.token || !payload.user) throw new Error('Registration failed');
    return { ...payload, success: true };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      const body = err.response.data as { message?: string; error?: string } | undefined;
      const msg = body?.message ?? body?.error;
      if (msg) throw new Error(msg);
    }
    throw err;
  }
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me');
  return unwrap(res) as User;
}

export function setToken(token: string): void {
  localStorage.setItem('cts_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('cts_token');
  localStorage.removeItem('cts_user');
}

export function getStoredToken(): string | null {
  return localStorage.getItem('cts_token');
}
