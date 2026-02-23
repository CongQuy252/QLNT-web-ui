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
  _id: string;
  email: string;
  name: string;
  role: number;
  phone: string;
  cccdImages: {
    front: { url: string; publicId: string };
    back: { url: string; publicId: string };
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
    _id: string;
    email: string;
    name: string;
    role: number;
    phone: string;
    cccd?: string;
  };
}

export interface GetAllUsersRequest {
  email?: string;
  name?: string;
  phone?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetAllUsersResponse {
  message: string;
  data: GetUserResponse[];
  pagination: Pagination;
}
