export interface Building {
  _id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  totalFloors: number;
  totalRooms: number;
  yearBuilt: number;
  ownerId: string;
  description?: string;
  utilities?: string[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BuildingListResponse {
  message: string;
  data: Building[];
  pagination: Pagination;
}
