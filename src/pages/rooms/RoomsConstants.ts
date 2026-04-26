import { ROOMSTATUS } from '@/types/room';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case ROOMSTATUS.AVAILABLE:
      return 'bg-green-100 text-green-800';
    case ROOMSTATUS.OCCUPIED:
      return 'bg-blue-100 text-blue-800';
    case ROOMSTATUS.MAINTENANCE:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: ROOMSTATUS | string) => {
  switch (status) {
    case ROOMSTATUS.AVAILABLE:
      return 'Trống';
    case ROOMSTATUS.OCCUPIED:
      return 'Đã cho thuê';
    case ROOMSTATUS.MAINTENANCE:
      return 'Bảo trì';
    case '0':
      return 'Tất cả';
    default:
      return status;
  }
};
