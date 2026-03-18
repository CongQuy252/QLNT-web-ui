export interface IMeterReading {
  _id: string;
  roomId: {
    _id: string;
    number: string;
    buildingId: string; // Changed from object to string
  };
  month: number;
  year: number;
  electricityReading: number;
  waterReading: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateMeterReadingDto {
  roomId: string;
  month: number;
  year: number;
  electricityReading: number;
  waterReading: number;
}

export interface UpdateMeterReadingDto {
  electricityReading?: number;
  waterReading?: number;
}

export interface MeterReadingResponse {
  meterReadings: IMeterReading[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
