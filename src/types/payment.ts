export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
}

export interface Payment {
  _id: string;
  tenantId: string;
  roomId: string;
  month: string;
  electricityPrevious: number;
  electricityCurrent: number;
  electricityAmount: number;
  waterPrevious: number;
  waterCurrent: number;
  waterAmount: number;
  otherFee?: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentItem = Payment;

export type InvoiceForm = Omit<Payment, '_id' | 'status' | 'paidDate' | 'createdAt' | 'updatedAt'>;

export interface TenantOption {
  user: {
    _id: string;
    name: string;
  };
}
