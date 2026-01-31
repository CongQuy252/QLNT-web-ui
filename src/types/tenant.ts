export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  roomId: string;
  moveInDate: string;
  contractEndDate: string;
  status: 'active' | 'inactive';
  emergencyContact?: string;
}
