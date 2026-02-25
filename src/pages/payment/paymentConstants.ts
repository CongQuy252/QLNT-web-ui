import { payments, rooms, tenants } from '@/pages/payment/mockData/paymentMockData';

export const maxItemPerPage = 10;

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export const getAllRooms = () => rooms;

export const getRoomById = (id: string) => rooms.find((r) => r._id === id);

export const getAllTenants = () => tenants;

export const getTenantById = (id: string) => tenants.find((t) => t.user._id === id);

export const getTenantByRoom = (roomId: string) =>
  tenants.find((t) => t.room._id === roomId && t.status === 'active');

export const getPaymentsByOwner = () => payments;

export const getPaymentsByTenant = (tenantId: string) =>
  payments.filter((p) => p.tenantId === tenantId);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPayment = (payment: any) => {
  payments.unshift({
    id: crypto.randomUUID(),
    status: 'pending',
    ...payment,
  });
};

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
