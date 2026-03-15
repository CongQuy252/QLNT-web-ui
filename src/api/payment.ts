import { queryClient } from '@/lib/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useGetPaymentByUserId = (userId?: string, isEnable = true) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.payment, userId],
    queryFn: async () => {
      const response = await http.get<Payment[]>(`/payments/tenant/${userId}`);
      return response.data[0];
    },
    meta: {
      handleError: handleHttpError,
    },
    enabled: isEnable || !!userId,
  });
};

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

export const useGetPaymentsQuery = (
  page = 1,
  limit = 10,
  search = '',
  status = '',
  isEnabled = true,
) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.payments, page, limit, search, status],
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
    mutationFn: async (
      paymentData: Omit<Payment, '_id' | 'status' | 'paidDate' | 'createdAt' | 'updatedAt'>,
    ) => {
      const response = await http.post<Payment>('/payments', paymentData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate room queries since payment creation may change room availability
      queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
      queryClient.invalidateQueries({ queryKey: [QueriesKey.occupiedRooms] });
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
    onSuccess: () => {
      // Invalidate payment queries after update
      queryClient.invalidateQueries({ queryKey: [QueriesKey.payments] });
      queryClient.invalidateQueries({ queryKey: [QueriesKey.payment] });
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
    onSuccess: () => {
      // Invalidate payments query
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: handleHttpError,
  });
};
