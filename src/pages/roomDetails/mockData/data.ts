import { RoomStatus } from '@/constants/appConstants';
import type { Room } from '@/types/room';

export const room: Room = {
  id: 'room2',
  number: '102',
  building: 'A',
  floor: 1,
  area: 30,
  price: 3500000,
  status: RoomStatus.occupied,
  images: [
    'https://i.pinimg.com/736x/a0/e4/c1/a0e4c1f86074c44b006a3ac985604d30.jpg',
    'https://i.pinimg.com/736x/02/a6/c3/02a6c34aa1bd7ed6837bb75f37e61dff.jpg',
    'https://i.pinimg.com/736x/8a/ef/e5/8aefe52d46163b04fcd593350459327a.jpg',
  ],
  currentTenant: 'tenant2',
  description: 'Phòng đôi, có toilet riêng',
};

export const tenant = {
  id: 'tenant1',
  name: 'Nguyễn Văn A',
  idNumber: '0123456789',
  email: 'nguyenvana@example.com',
  phone: '0987654321',
  contractEndDate: '2025-12-31',
  status: 'active',
};
