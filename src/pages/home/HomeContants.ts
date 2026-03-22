import { BarChart3, CreditCard, DoorOpen, Users } from 'lucide-react';
import type { IconType } from 'react-icons/lib';
import { MdApartment } from 'react-icons/md';

import { Path, PaymentStatus } from '@/constants/appConstants';

export interface NavigationItem {
  rowId: string;
  title: string;
  description: string;
  icon: IconType;
  path: string;
  color: string;
}

export const ownerListFunctions: NavigationItem[] = [
  {
    rowId: '2',
    title: 'Quản lý Toà Nhà',
    description: 'Xem danh toà nhà, căn hộ cho thuê',
    icon: MdApartment,
    path: `/${Path.buildings}`,
    color: 'from-orange-500 to-orange-600',
  },
  {
    rowId: '3',
    title: 'Quản lý Phòng',
    description: 'Xem danh sách phòng, trạng thái, giá thuê',
    icon: DoorOpen,
    path: `/${Path.rooms}`,
    color: 'from-blue-500 to-blue-600',
  },
  {
    rowId: '4',
    title: 'Quản lý Người Thuê',
    description: 'Thông tin người thuê, hợp đồng, liên hệ',
    icon: Users,
    path: `/${Path.tenants}`,
    color: 'from-purple-500 to-purple-600',
  },
  {
    rowId: '5',
    title: 'Thanh Toán',
    description: 'Theo dõi khoản thanh toán, doanh thu',
    icon: CreditCard,
    path: `/${Path.payments}`,
    color: 'from-green-500 to-green-600',
  },
  {
    rowId: '6',
    title: 'Thống Kê',
    description: 'Xem báo cáo doanh thu, thống kê',
    icon: BarChart3,
    path: `/${Path.statistics}`,
    color: 'from-pink-500 to-pink-600',
  },
];

export const tenantListFunctions: NavigationItem[] = [
  {
    rowId: '2',
    title: 'Thanh Toán Tiền Phòng',
    description: 'Xem và quản lý các khoản thanh toán',
    icon: CreditCard,
    path: `/${Path.payments}`,
    color: 'from-green-500 to-green-600',
  },
];

export const welcomeMessages = () => {
  const time = new Date().getHours();
  if (time < 12) return 'Chào buổi sáng, ';
  if (time < 18) return 'Chào buổi chiều, ';
  return 'Chào buổi tối, ';
};

export enum ownerIcon {
  owner = '👤',
  tenant = '🚪',
}

export const getPaymentStatus = (status?: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return '✓ Đã thanh toán';
    case PaymentStatus.PENDING:
      return '⏳ Chờ thanh toán';
    case PaymentStatus.OVERDUE:
      return '⚠ Quá hạn';
    default:
      return 'Không rõ';
  }
};
