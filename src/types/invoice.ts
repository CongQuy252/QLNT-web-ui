import type { Member } from './room';

export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export interface TenantInfo {
  _id: string;
  name: string;
  phone: string;
  isRepresentative: boolean;
}

export interface Invoice {
  _id: string;
  tenantId: string | null; // member._id or null
  tenantInfo?: TenantInfo; // populated by backend
  roomId: {
    _id: string;
    number: string;
    buildingId: {
      _id: string;
      name: string;
    };
    members?: Member[];
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
  livingFee?: number;
  serviceFee?: number;
  otherFee?: number;
  dueDate?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Union type for both Payment and Invoice
export type PaymentOrInvoice = import('./payment').Payment | Invoice;
