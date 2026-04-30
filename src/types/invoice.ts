import type { GetRoom } from './room';

export enum InvoiceStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export interface TenantInfo {
  _id: string;
  name: string;
  phone: string;
  isRepresentative: boolean;
}

export interface Invoice {
  _id: string;
  tenantId: string | null;
  tenantInfo?: TenantInfo;
  roomId: GetRoom;
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

export type PaymentOrInvoice = import('./payment').Payment | Invoice;

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetInvoiceResponse {
  success: boolean;
  data: {
    invoices: Invoice[];
    pagination: Pagination;
  };
}

export interface GetInvoiceByIdResponse {
  success: boolean;
  data: Invoice;
}
