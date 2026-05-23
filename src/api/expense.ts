import { http } from '@/lib/axios';
import type {
  CreateExpenseInput,
  Expense,
  ExpensesResponse,
  GetExpensesParams,
} from '@/types/expense';

export const getExpenses = async (params?: GetExpensesParams): Promise<ExpensesResponse> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { buildingId, category, startDate, endDate, page = 1, limit = 10 } = params || {};
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
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createExpense = async (data: CreateExpenseInput): Promise<Expense> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.post('/expenses', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  // eslint-disable-next-line no-useless-catch
  try {
    await http.delete(`/expenses/${id}`);
  } catch (error) {
    throw error;
  }
};
