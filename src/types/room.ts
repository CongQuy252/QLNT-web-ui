import type { RoomStatus } from '@/constants/appConstants';

export interface Room {
  id: string;
  number: string;
  building: string;
  floor: number;
  area: number;
  price: number;
  status: RoomStatus;
  images: string[];
  currentTenant?: string; // tenant id
  description?: string;
}
