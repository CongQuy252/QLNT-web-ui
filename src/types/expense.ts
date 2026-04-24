export enum ExpenseCategory {
  MAINTENANCE = 'maintenance',
  FURNITURE = 'furniture',
  UTILITY_BILL = 'utility',
  TAX = 'tax',
  OTHER = 'other',
}

export interface Expense {
  _id: string;
  buildingId: {
    _id: string;
    name: string;
  };
  electricityAmount: number;
  waterAmount: number;
  houseAmount: number;
  livingFeeAmount: number;
  otherFee: number;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  buildingId: string;
  electricityAmount: number;
  waterAmount: number;
  houseAmount: number;
  livingFeeAmount: number;
  otherFee: number;
  expenseDate: string;
}

export interface GetExpensesParams {
  buildingId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ExpensesResponse {
  expenses: Expense[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
