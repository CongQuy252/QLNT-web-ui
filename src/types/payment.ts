export interface InvoiceForm {
  roomId: string;
  amount: number;
  description?: string;
  dueDate?: string;
  waterPrevious?: number;
  waterCurrent?: number;
  electricityPrevious?: number;
  electricityCurrent?: number;
  otherFees?: {
    name: string;
    amount: number;
  }[];
}

export interface Payment {
  _id: string;
  invoiceId: string;
  roomId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}
