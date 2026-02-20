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
  message: string;
  data: Room[];
  pagination: Pagination;
}
