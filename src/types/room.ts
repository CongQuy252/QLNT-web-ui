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
  buildingName?: string; // For display purposes
  floor: number;
  area: number;
  price: number;
  electricityUnitPrice: number;
  waterPricePerPerson?: number;
  waterPricePerCubicMeter?: number;
  waterCalculationType?: 'm3' | 'person';
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
  buildingId: {
    _id: string;
    name: string;
  };
  floor: number;
  area: number;
  price: number;
  electricityUnitPrice: number;
  waterPricePerPerson?: number;
  waterPricePerCubicMeter?: number;
  waterCalculationType?: 'm3' | 'person';
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
  waterPricePerPerson?: number;
  waterPricePerCubicMeter?: number;
  waterCalculationType?: 'm3' | 'person';
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

export interface RoomWithMeterReading {
  _id: string;
  number: string;
  area: number;
  price: number;
  electricityUnitPrice: number;
  waterPricePerPerson: number;
  waterPricePerCubicMeter: number;
  internetFee: number;
  parkingFee: number;
  serviceFee: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  building: {
    _id: string;
    name: string;
    address: string;
  };
  tenant: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  meterReading: {
    _id: string;
    month: number;
    year: number;
    electricityReading: number;
    waterReading: number;
    createdAt: string;
  };
}

export interface RoomsWithMeterReadingsResponse {
  message: string;
  data: RoomWithMeterReading[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
