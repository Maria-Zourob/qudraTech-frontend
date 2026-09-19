import {apiClient} from '@/lib/apiClient';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  roles: string[];
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/auth/login', {email, password});
}