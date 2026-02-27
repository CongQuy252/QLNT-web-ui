import { useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { Payment } from '@/types/payment';

export const useGetPaymentByIdQuery = (paymentId?: string, isEnable = true) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.payment, paymentId],
    queryFn: async () => {
      const response = await http.get<Payment>(`/payments/${paymentId}`);
      return response.data;
    },
    meta: {
      handleError: handleHttpError,
    },
    enabled: isEnable || !!paymentId,
  });
};
