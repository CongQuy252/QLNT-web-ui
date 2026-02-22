import type { TenantStatus, UserRole } from '@/constants/appConstants';
import type { Pagination } from '@/types/building';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phone?: string;
  cccd?: string;
  cccdImages: {
    front: { url: string; publicId: string };
    back: { url: string; publicId: string };
  };
  createdAt: Date;
  updatedAt: Date;
}

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
  role: UserRole;
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

export interface UpdateTenantRequest {
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  cccdImagesFront: string | File;
  cccdImagesBack: string | File;
  // roomId: string;
  // occupation: string;
  // contractStartDate: string;
  // contractEndDate: string;
}

export interface UserResponse {
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
  status: TenantStatus;
}

export interface GetTenantListResponse {
  message: string;
  data: UserResponse[];
  pagination: Pagination;
}
