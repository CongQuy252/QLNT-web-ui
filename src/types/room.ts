import type { Pagination } from '@/types/building';

export enum ROOMSTATUS {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export interface Member {
  userId?: string;
  name: string;
  phone: string;
  licensePlate?: string;
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
  isRepresentative: boolean;
}

export interface Room {
  _id: string;
  number: string;
  buildingId: string;
  buildingName?: string; // For display purposes
  area: number;
  status: ROOMSTATUS;
  price: number;
  electricityUnitPrice: number;
  waterPricePerPerson: number;
  waterPricePerCubicMeter: number;
  parkingFee: number;
  livingFee: number;
  deposit?: number;
  members: Member[];
  description?: string;
  isDeleted: boolean;
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
  area: number;
  status: ROOMSTATUS;
  price: number;
  electricityUnitPrice: number;
  waterPricePerPerson: number;
  waterPricePerCubicMeter: number;
  parkingFee: number;
  livingFee: number;
  deposit?: number;
  members: Member[];
  description?: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PutRoom {
  id: string;
  number: string;
  buildingId: string;
  area: number;
  status: ROOMSTATUS;
  price: number;
  electricityUnitPrice: number;
  waterPricePerPerson: number;
  waterPricePerCubicMeter: number;
  parkingFee: number;
  livingFee: number;
  deposit?: number;
  members?: Member[];
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
