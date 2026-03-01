import type { Pagination } from '@/types/building';

export enum ROOMSTATUS {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export interface Room {
  _id: string;
  number: string;
  buildingId: string;
  floor: number;
  area: number;
  price: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  internetFee?: number;
  parkingFee?: number;
  serviceFee?: number;
  status: ROOMSTATUS;
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
  buildingId: string;
  floor: number;
  area: number;
  price: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  internetFee?: number;
  parkingFee?: number;
  serviceFee?: number;
  status: ROOMSTATUS;
  description?: string;
  currentTenant?: {
    _id: string;
    email: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PutRoom {
  id: string;
  number: string;
  buildingId: string;
  floor: number;
  area: number;
  price: number;
  electricityUnitPrice: number;
  waterUnitPrice: number;
  internetFee?: number;
  parkingFee?: number;
  serviceFee?: number;
  status: ROOMSTATUS;
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
