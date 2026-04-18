export interface InvoiceForm {
  tenantId: string;
  roomId: string;
  month: number;
  year: number;
  dueDate: string;
  notes?: string;

  // ĐIỆN
  electricityPrevious: number;
  electricityCurrent: number;
  electricityUsage: number;
  electricityUnitPrice: number;
  electricityCost: number;

  // NƯỚC
  waterPrevious: number;
  waterCurrent: number;
  waterUsage: number;
  waterUnitPrice: number;
  waterCost: number;

  // PHÍ
  rentAmount: number;
  parkingFee: number;
  livingFee: number;
  otherFee: number;

  totalAmount: number;
}

export interface Payment {
  _id: string;
  invoiceId: string;
  tenantId: string;
  roomId: string;
  amount: number;
  month: number;
  year: number;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}
