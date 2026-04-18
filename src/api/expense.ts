import { http } from '@/lib/axios';
import type {
  CreateExpenseInput,
  Expense,
  ExpensesResponse,
  GetExpensesParams,
} from '@/types/expense';

// Get expenses with filters and pagination
export const getExpenses = async (params?: GetExpensesParams): Promise<ExpensesResponse> => {
  try {
    const { buildingId, category, startDate, endDate, page = 1, limit = 10 } = params || {};

    // Build query string
    const queryParams = new URLSearchParams();

    if (buildingId) {
      queryParams.append('buildingId', buildingId);
    }

    if (category) {
      queryParams.append('category', category);
    }

    if (startDate) {
      queryParams.append('startDate', startDate);
    }

    if (endDate) {
      queryParams.append('endDate', endDate);
    }

    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const response = await http.get(`/expenses?${queryParams.toString()}`);
    return response.data.data; // Return the inner data object
  } catch (error) {
    throw error;
  }
};

// Create expense
export const createExpense = async (data: CreateExpenseInput): Promise<Expense> => {
  try {
    const response = await http.post('/expenses', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update expense
export const updateExpense = async (
  id: string,
  expenseData: Partial<Expense>,
): Promise<Expense> => {
  try {
    const response = await http.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (id: string): Promise<void> => {
  try {
    await http.delete(`/expenses/${id}`);
  } catch (error) {
    throw error;
  }
};
