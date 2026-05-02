export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  bio?: string;
  avatarData?: string;
  coverData?: string;
}

export interface UserUpdateDto {
  fullName: string;
  email: string;
  bio?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserProfileDto extends UserDto {
  friendCount: number;
  isFriend: boolean;
  requestSent: boolean;
}
