import { useMutation, useQuery } from '@tanstack/react-query';

import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { Payment } from '@/types/payment';

export interface PaymentListResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useGetPaymentsQuery = (page = 1, limit = 10, search = '', status = '', isEnabled = true) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: ['payments', page, limit, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (status && status !== 'all') params.append('status', status);
      
      const response = await http.get<PaymentListResponse>(`/payments?${params.toString()}`);
      return response.data;
    },
    enabled: isEnabled,
    meta: { handleError: handleHttpError },
  });
};

export const useCreatePaymentMutation = () => {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (paymentData: Omit<Payment, '_id' | 'status' | 'paidDate' | 'createdAt' | 'updatedAt'>) => {
      const response = await http.post<Payment>('/payments', paymentData);
      return response.data;
    },
    onError: handleHttpError,
  });
};

export const useUpdatePaymentMutation = () => {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Payment> }) => {
      const response = await http.put<Payment>(`/payments/${id}`, data);
      return response.data;
    },
    onError: handleHttpError,
  });
};

export const useDeletePaymentMutation = () => {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/payments/${id}`);
      return id;
    },
    onError: handleHttpError,
  });
};
