export interface MeterReading {
  _id: string;
  roomId: {
    _id: string;
    number: string;
    buildingId: string;
  };
  month: number;
  year: number;
  electricityReading: number;
  waterReading: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface BulkMeterReadingDto {
  meterReadings: {
    roomId: string;
    electricityReading: number;
    waterReading: number;
    month: number;
    year: number;
  }[];
}

export interface BulkMeterReadingResponse {
  message: string;
  data: {
    _id: string;
    roomId: string;
    month: number;
    year: number;
    electricityReading: number;
    waterReading: number;
    createdAt: string;
    updatedAt: string;
  }[];
  errors: string[];
  errorRoomIds?: string[];
}
