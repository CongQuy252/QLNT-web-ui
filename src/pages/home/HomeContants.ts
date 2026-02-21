import { CreditCard, DoorOpen, Home, Users } from 'lucide-react';
import type { IconType } from 'react-icons/lib';
import { MdApartment } from 'react-icons/md';

import { Path } from '@/constants/appConstants';

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
];

export const tenantListFunctions: NavigationItem[] = [
  {
    rowId: '2',
    title: 'Thông Tin Phòng',
    description: 'Xem thông tin phòng của bạn',
    icon: Home,
    path: `/${[Path.rooms, Path.roomId, Path.tenants, Path.userId].join('/')}`,
    color: 'from-blue-500 to-blue-600',
  },
  {
    rowId: '3',
    title: 'Thanh Toán Tiền Phòng',
    description: 'Xem và quản lý các khoản thanh toán',
    icon: CreditCard,
    path: `/${Path.buildings}/${Path.buildingId}/${Path.rooms}/${Path.roomId}/${Path.payments}`,
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
