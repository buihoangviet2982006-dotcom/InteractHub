export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  fullName: string;
  password?: string;
}

export interface AuthResponseDto {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface AvatarUpdateDto {
  avatarUrl: string;
}

export interface AvatarUpdateResponseDto {
  userId: number;
  avatarUrl?: string;
}

export interface DecodedToken {
  UserId: string;
  email: string;
  sub: string;
  role: string;
  jti: string;
  exp: number;
  iss: string;
  aud: string;
  [key: string]: any;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
}
