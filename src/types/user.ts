export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  avatarUrl: string;
  fullName: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface GetUserResponse {
  username: string;
  id: string;
  email: string;
}
