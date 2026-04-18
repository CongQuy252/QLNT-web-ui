import { http } from '@/lib/axios';

export interface ConfirmPaymentInput {
  invoiceId: string;
  amount: number;
  paidAt?: Date;
  paymentMethod?: string;
  note?: string;
}

export interface ConfirmPaymentResponse {
  payment: {
    _id: string;
    invoiceId: {
      _id: string;
      roomId: {
        _id: string;
        buildingId: {
          _id: string;
          name: string;
        };
      };
    };
    amount: number;
    paidAt: string;
    paymentMethod?: string;
    note?: string;
  };
  invoice: {
    _id: string;
    status: string;
  };
  totalPaid: number;
}

export interface RevenueByBuilding {
  buildingId: string;
  buildingName: string;
  month: number;
  year: number;
  totalAmount: number;
  count: number;
}

export interface ExpenseByBuilding {
  buildingId: string;
  buildingName: string;
  month: number;
  year: number;
  totalAmount: number;
  count: number;
}

export interface DashboardSummary {
  summary: {
    totalRevenue: number;
    totalExpense: number;
    profit: number;
    month: number;
    year: number;
  };
  revenueByBuilding: RevenueByBuilding[];
  expenseByBuilding: ExpenseByBuilding[];
}

export const confirmPayment = async (
  data: ConfirmPaymentInput,
): Promise<ConfirmPaymentResponse> => {
  try {
    const response = await http.post('/payments/confirm', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRevenueByBuilding = async (
  month?: number,
  year?: number,
): Promise<RevenueByBuilding[]> => {
  try {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());

    const response = await http.get(`/payments/revenue/building?${params.toString()}`);

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getExpensesByBuilding = async (
  month?: number,
  year?: number,
): Promise<ExpenseByBuilding[]> => {
  try {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());

    const response = await http.get(`/expenses/building?${params.toString()}`);

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const getDashboardSummary = async (
  month?: number,
  year?: number,
): Promise<DashboardSummary> => {
  try {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());

    const response = await http.get(`/dashboard/summary?${params.toString()}`);

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else {
      return {
        summary: {
          totalRevenue: 0,
          totalExpense: 0,
          profit: 0,
          month: month ?? new Date().getMonth() + 1,
          year: year ?? new Date().getFullYear(),
        },
        revenueByBuilding: [],
        expenseByBuilding: [],
      };
    }
  } catch (error) {
    throw error;
  }
};
