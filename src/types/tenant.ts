import type { TenantStatus } from '@/constants/appConstants';
import type { Pagination } from '@/types/building';
import type { Room } from '@/types/room';
import type { User } from '@/types/user';

export interface Tenant {
  user: Pick<User, '_id' | 'name' | 'email' | 'phone' | 'cccd'>;
  room: Pick<Room, '_id' | 'number'>;
  moveInDate: string;
  contractEndDate: string;
  status: TenantStatus;
  emergencyContact?: string;
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
