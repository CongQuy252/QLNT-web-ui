export const maxItemPerPage = 10;

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'paid':
      return '✓ Đã thanh toán';
    case 'pending':
      return '⏳ Chờ thanh toán';
    case 'overdue':
      return '⚠ Quá hạn';
    default:
      return status;
  }
};
