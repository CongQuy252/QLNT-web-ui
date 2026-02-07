export interface Payment {
  id: string;
  tenantId: string;
  roomId: string;
  amount: number;
  month: string; // YYYY-MM
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  notes?: string;
}
