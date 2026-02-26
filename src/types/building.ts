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
  roomStatus?: {
    available: number;
    occupied: number;
    maintenance: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RoomStatus {
  available: number;
  occupied: number;
  maintenance: number;
}

export type BuildingWithRoomStatus = Building & {
  roomStatus: RoomStatus;
};

export interface BuildingListResponse {
  message: string;
  data: BuildingWithRoomStatus[];
  pagination: Pagination;
}

export type GetBuildingByIdOmit = Omit<Building, 'roomStatus'>;

export interface GetBuildingByIdResponse {
  message: string;
  data: GetBuildingByIdOmit;
}
