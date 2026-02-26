import type { PaymentStatus } from '@/pages/payment/paymentConstants';

export interface Payment {
  _id: string;
  tenantId: string; //
  roomId: string; //
  month: string; //

  roomFee: number; //

  electricityUnitPrice: number; //
  electricityPrevious: number; //
  electricityCurrent: number; //
  electricityAmount: number; //

  waterUnitPrice: number; //
  waterPrevious: number; //
  waterCurrent: number; //
  waterAmount: number; //

  internetFee?: number; //
  serviceFee?: number; //

  amount: number; //

  dueDate: string; //
  paidDate?: string;

  status: PaymentStatus;
}

export type PaymentItem = Payment;

export type InvoiceForm = Omit<Payment, '_id' | 'status' | 'paidDate'>;

export interface TenantOption {
  user: {
    _id: string;
    name: string;
  };
}
