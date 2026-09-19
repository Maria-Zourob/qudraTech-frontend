const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {token, headers, ...rest} = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
      ...headers
    }
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new ApiError(response.status, errorBody || response.statusText);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, token?: string) => request<T>(path, {method: 'GET', token}),
  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {method: 'POST', body: JSON.stringify(body), token}),
  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {method: 'PUT', body: JSON.stringify(body), token}),
    patch: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, {method: 'PATCH', body: JSON.stringify(body), token}),
  delete: <T>(path: string, token?: string) => request<T>(path, {method: 'DELETE', token})
};

export {ApiError};