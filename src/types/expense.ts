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
  title: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseInput {
  buildingId: string;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
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
