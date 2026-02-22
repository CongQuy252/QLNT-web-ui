import type { Room } from '@/types/room';
import type { User } from '@/types/user';

export interface Tenant {
  user: Pick<User, '_id' | 'name' | 'email' | 'phone' | 'cccd'>;
  room: Pick<Room, '_id' | 'number'>;
  moveInDate: string;
  contractEndDate: string;
  status: 'active' | 'inactive';
  emergencyContact?: string;
}
