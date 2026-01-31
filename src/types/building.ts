export interface Building {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  totalFloors: number;
  totalRooms: number;
  yearBuilt: number;
  owner: string;
  phone: string;
  email: string;
  description?: string;
  utilities?: string[];
}
