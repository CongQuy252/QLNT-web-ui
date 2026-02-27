import type { RoomStatus } from '@/constants/appConstants';
import type { Pagination } from '@/types/building';

export interface Room {
  _id: string;
  number: string;
  building: string;
  buildingId?: string;
  floor: number;
  area: number;
  price: number;
  status: RoomStatus;
  currentTenant?: {
    _id: string;
    email: string;
    name: string;
  };
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomListResponse {
  rooms: GetRoom[];
  pagination: Pagination;
}

export interface GetRoom {
  _id: string;
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
  currentTenant?: {
    _id: string;
    email: string;
    name: string;
  };
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

export interface GetRoomByIdResponse {
  message: string;
  room: GetRoom;
}
