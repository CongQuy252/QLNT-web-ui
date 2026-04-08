import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/axios';
import { QueriesKey } from '@/constants/appConstants';

// Get payments by user ID
export const useGetPaymentByUserId = (userId?: string, isEnabled = true) => {
  return useQuery({
    queryKey: [QueriesKey.payments, userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await http.get(`/payments/user/${userId}`);
      return response.data;
    },
    enabled: isEnabled && !!userId,
  });
};

// Get payment by ID
export const getPaymentById = async (paymentId: string) => {
  try {
    const response = await http.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
