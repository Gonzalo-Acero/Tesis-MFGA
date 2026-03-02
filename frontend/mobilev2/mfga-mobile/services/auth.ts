import { requestJson } from '@/lib/http';
import type { SessionPayload, SessionUser } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: SessionUser;
}

interface RegisterPayload {
  Name: string;
  Email: string;
  Password: string;
  PhoneNumber?: string | null;
}

interface RegisterResponse {
  message: string;
  user: SessionUser;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetryLogin = (error: unknown) =>
  error instanceof Error &&
  /backend is waking up|could not reach the backend/i.test(error.message);

export const login = async (payload: LoginPayload): Promise<SessionPayload> => {
  let response: LoginResponse;

  try {
    response = await requestJson<LoginResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    if (!shouldRetryLogin(error)) {
      throw error;
    }

    await delay(2500);
    response = await requestJson<LoginResponse>('/auth/login', {
      method: 'POST',
      body: payload,
    });
  }

  return {
    provider: 'custom-api',
    token: response.token || null,
    user: response.user || null,
    raw: response,
    createdAt: Date.now(),
  };
};

export const register = (payload: RegisterPayload) =>
  requestJson<RegisterResponse>('/users', {
    method: 'POST',
    body: payload,
  });

export const changePassword = (
  token: string,
  payload: {
    userId: number;
    currentPassword: string;
    newPassword: string;
  }
) =>
  requestJson<{ message: string }>('/auth/change-password', {
    method: 'POST',
    token,
    body: payload,
  });
