import { http } from './http';
import type { UserProfileDto, UserUpdateDto, ChangePasswordDto } from '../types/user';

export const userService = {
  updateProfile: async (data: UserUpdateDto): Promise<UserProfileDto> => {
    const response = await http.patch<UserProfileDto>('/users/me/profile', data);
    return response.data;
  },

  getProfile: async (userId: number): Promise<UserProfileDto> => {
    const response = await http.get<UserProfileDto>(`/users/${userId}`);
    return response.data;
  },

  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await http.post('/users/me/change-password', data);
  },

  updateAvatar: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await http.patch('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateCover: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await http.patch('/users/me/cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};
