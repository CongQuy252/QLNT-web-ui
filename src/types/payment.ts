import type { PaymentStatus } from '@/pages/payment/paymentConstants';

export interface Payment {
  id: string;
  tenantId: string;
  roomId: string;
  month: string; // YYYY-MM
  amount: number;
  dueDate: string; // YYYY-MM-DD
  paidDate?: string;
  status: PaymentStatus;
  notes?: string;
}
