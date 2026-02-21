import type { RoomStatus } from '@/constants/appConstants';
import type { Pagination } from '@/types/building';

export interface Room {
  id: string;
  number: string;
  building: string;
  buildingId?: string; // Add buildingId for backend compatibility
  floor: number;
  area: number;
  price: number;
  status: RoomStatus;
  images: string[];
  currentTenant?: string; // tenant id
  description?: string;
}

export interface RoomListResponse {
  rooms: GetRoom[];
  pagination: Pagination;
}

export interface GetRoom {
  id: string;
  number: string;
  buildingId?: {
    _id: string;
    name: string;
  };
  floor: number;
  area: number;
  price: number;
  status: RoomStatus;
  description?: string;
}

export interface PutRoom {
  id: string;
  number: string;
  buildingId?: string;
  floor: number;
  area: number;
  price: number;
  status: RoomStatus;
  description?: string;
}

export interface PutRoomResponse {
  message: string;
  data: PutRoom;
}

export type PutRoomRequest = Omit<PutRoom, 'id'>;
