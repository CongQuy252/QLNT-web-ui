import type { TenantStatus } from '@/constants/appConstants';
import type { Pagination } from '@/types/building';
import type { Room } from '@/types/room';
import type { User } from '@/types/user';

export interface Tenant {
  _id: string;
  userId: Pick<User, '_id' | 'name' | 'email' | 'phone' | 'cccd'> & Partial<Pick<User, 'cccdImages'>>;
  roomId: Pick<Room, '_id' | 'number' | 'floor' | 'area' | 'price' | 'buildingId'>;
  moveInDate: string;
  contractEndDate: string;
  status: TenantStatus;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
  // Add user info for backward compatibility with frontend
  name?: string;
  email?: string;
  phone?: string;
  cccd?: string;
  cccdImages?: {
    front: {
      url: string;
      publicId: string;
    };
    back: {
      url: string;
      publicId: string;
    };
  };
  role?: number;
}

export interface UserResponse {
  cccdImages?: {
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
  data: Tenant[];
  pagination: Pagination;
}
