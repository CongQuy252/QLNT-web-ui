import type { UserRole } from '@/constants/appConstants';

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phone: string;
  cccd?: string;
  cccdImages: {
    front: { url: string; publicId: string };
    back: { url: string; publicId: string };
  };
  createdAt: Date;
  updatedAt: Date;
}

export type UserRoom = Omit<User, 'password' | 'createdAt' | 'updatedAt'>;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: GetUserResponse;
}

export interface GetUserResponse {
  id: string;
  email: string;
  name: string;
  role: number;
  phone: string;
  cccdImages: {
    front: string;
    back: string;
  };
}

export interface GetUserByIdResponse {
  message: string;
  data: {
    cccdImages: {
      front: {
        url: string;
        publicId: string;
      };
      back: {
        url: string;
        publicId: string;
      };
    };
    id: string;
    email: string;
    name: string;
    role: number;
    phone: string;
    cccd?: string;
  };
}
