export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
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
  rentAmount: number;
  internetFeeAmount: number;
  parkingFeeAmount: number;
  serviceFeeAmount: number;
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

export interface GetPaymentByUserId {
  _id: string;
  tenantId: string;
  roomId: {
    _id: string;
    number: string;
    buildingId: {
      _id: string;
      name: string;
    };
    floor: number;
  };
  month: string;
  electricityPrevious: number;
  electricityCurrent: number;
  electricityAmount: number;
  waterPrevious: number;
  waterCurrent: number;
  waterAmount: number;
  otherFee: number;
  rentAmount: number;
  internetFeeAmount: number;
  parkingFeeAmount: number;
  serviceFeeAmount: number;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}
