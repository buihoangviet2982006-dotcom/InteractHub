import { http } from './http';
import type { LoginDto, RegisterDto, AuthResponseDto } from '../types/auth';

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await http.post<AuthResponseDto>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await http.post<AuthResponseDto>('/auth/register', data);
    return response.data;
  }
};
