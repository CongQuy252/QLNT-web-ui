import { useMutation, useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';

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
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useExportInvoices = () => {
  const handleHttpError = useHandleHttpError();
  return useMutation({
    mutationFn: async (invoiceIds: string[]) => {
      const response = await http.post(
        '/payments/export-zip',
        { invoiceIds },
        { responseType: 'blob' },
      );

      return response.data;
    },
    onError: handleHttpError,
  });
};
