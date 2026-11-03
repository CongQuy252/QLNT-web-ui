import type { TenantStatus, UserRole } from '@/constants/appConstants';
import type { Building } from '@/types/building';

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phone: string;
  cccd?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: GetUserLoginResponse;
}

export interface GetUserLoginResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
}

export interface GetUserResponse {
  _id: string;
  email: string;
  name: string;
  role: number;
  phone: string;
  cccd?: string;
  assignBuilding: string[];
}

export interface GetUserByIdResponse {
  message: string;
  data: GetUserResponse;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UpdateUserRequest {
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  cccd: string;
}

export interface UserResponse {
  _id: string;
  email: string;
  name: string;
  role: number;
  phone: string;
  cccd?: string;
  status: TenantStatus;
  assignBuilding: Building[];
}

export interface GetUserListResponse {
  message: string;
  data: UserResponse[];
  pagination: Pagination;
}

export interface GetAllUserRequest {
  page: number;
  limit: number;
  searchCondition: {
    email?: string;
    name?: string;
    phone?: string;
  };
}
