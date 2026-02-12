import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = (): string | null => {
  return localStorage.getItem('cts_token');
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success?: boolean; error?: string; message?: string }>) => {
    const message = error.response?.data?.error ?? error.response?.data?.message ?? error.message ?? 'Request failed';
    console.error('API Error:', message);
    if (error.response?.status === 401) {
      localStorage.removeItem('cts_token');
      localStorage.removeItem('cts_user');
      window.dispatchEvent(new Event('cts-unauthorized'));
      toast.error('Session expired. Please sign in again.');
    }
    return Promise.reject(error);
  }
);

/** Unwrap backend response { success, data } and throw on failure */
export function unwrap<T>(response: { data: { success?: boolean; data?: T; error?: string; message?: string } }): T {
  const { data } = response.data;
  if (response.data.success === false) {
    throw new Error(response.data.error || response.data.message || 'Request failed');
  }
  return data as T;
}

export default api;

