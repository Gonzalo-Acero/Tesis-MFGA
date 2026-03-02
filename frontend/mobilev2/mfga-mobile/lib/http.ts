import { buildApiUrl, REQUEST_TIMEOUT_MS } from '@/lib/config';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
  absolute?: boolean;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const withTimeout = async (input: RequestInfo, init?: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const isAbortError = (error: unknown) =>
  error instanceof Error && error.name === 'AbortError';

const buildHeaders = (options: RequestOptions) => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return headers;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    if (typeof payload?.message === 'string') {
      return payload.message;
    }
    if (typeof payload?.error === 'string') {
      return payload.error;
    }
  } catch {
    // Ignore invalid JSON payloads
  }

  return `Request failed with status ${response.status}`;
};

export const requestJson = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  let response: Response;

  try {
    response = await withTimeout(options.absolute ? path : buildApiUrl(path), {
      method: options.method || 'GET',
      headers: buildHeaders(options),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new ApiError(
        'The backend is waking up. Wait a few seconds and try again.',
        408
      );
    }
    if (error instanceof TypeError) {
      throw new ApiError(
        'Could not reach the backend. Check your connection and try again.',
        0
      );
    }
    throw error;
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
