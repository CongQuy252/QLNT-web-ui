import { RoomStatus } from '@/constants/appConstants';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case RoomStatus.available:
      return 'bg-green-100 text-green-800';
    case RoomStatus.occupied:
      return 'bg-blue-100 text-blue-800';
    case RoomStatus.maintenance:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: RoomStatus | string) => {
  switch (status) {
    case RoomStatus.available:
      return 'Trống';
    case RoomStatus.occupied:
      return 'Đã cho thuê';
    case RoomStatus.maintenance:
      return 'Bảo trì';
    case RoomStatus.all:
      return 'Tất cả';
    default:
      return status;
  }
};
