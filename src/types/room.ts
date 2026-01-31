export interface Room {
  id: string;
  number: string;
  building: string;
  floor: number;
  area: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  currentTenant?: string; // tenant id
  description?: string;
}
