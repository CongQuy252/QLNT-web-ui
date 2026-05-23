import { useMutation } from '@tanstack/react-query';

import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';

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
