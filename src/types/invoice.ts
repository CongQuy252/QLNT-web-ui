export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export interface Invoice {
  _id: string;
  tenantId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  roomId: {
    _id: string;
    number: string;
    buildingId: {
      _id: string;
      name: string;
    };
  };
  month: number;
  year: number;
  status: InvoiceStatus;
  totalAmount: number;
  rentAmount?: number;
  electricityCost?: number;
  waterCost?: number;
  internetFee?: number;
  parkingFee?: number;
  serviceFee?: number;
  otherFee?: number;
  dueDate?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Union type for both Payment and Invoice
export type PaymentOrInvoice = import('./payment').Payment | Invoice;
