export interface Building {
  id: string;
  name: string;
  address: string;
  ward: string;
  city: string;
  totalFloors: number;
  totalRooms: number;
  yearBuilt: number;
  owner: string;
  description?: string;
  utilities?: string[];
}
