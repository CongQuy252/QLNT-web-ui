import { queryClient } from '@/lib/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { GetInvoiceByIdResponse, GetInvoiceResponse } from '@/types/invoice';

export const getBuildings = async () => {
  try {
    const response = await http.get('/buildings');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch {
    return [];
  }
};

export const getInvoicePreview = async (month: number, year: number) => {
  try {
    const params = new URLSearchParams({
      month: month.toString(),
      year: year.toString(),
    });

    const response = await http.get(`/invoices/invoice-preview?${params.toString()}`);
    const data = response.data;

    if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && Array.isArray(data.invoices)) {
      return data.invoices;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

export const bulkCreateInvoices = async (roomIds: string[], month: number, year: number) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.post('/invoices/bulk-create', {
      roomIds,
      month,
      year,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetInvoices = (
  options: {
    month?: number;
    year?: number;
    buildingId?: string;
    roomId?: string;
    status?: string;
    page: number;
    limit: number;
  },
  isEnabled?: boolean,
) => {
  const handleHttpError = useHandleHttpError();
  const params = new URLSearchParams({
    page: options.page.toString(),
    limit: options.limit.toString(),
  });

  if (options.month) {
    params.append('month', options.month.toString());
  }
  if (options.year) {
    params.append('year', options.year.toString());
  }
  if (options.buildingId) {
    params.append('buildingId', options.buildingId);
  }
  if (options.roomId) {
    params.append('roomId', options.roomId);
  }
  if (options.status) {
    params.append('status', options.status);
  }

  return useQuery({
    queryKey: [
      QueriesKey.invoices,
      options.page,
      options.limit,
      options.month,
      options.year,
      options.buildingId,
      options.roomId,
      options.status,
    ],
    queryFn: async () => {
      const response = await http.get<GetInvoiceResponse>(`/invoices?${params.toString()}`);
      return response.data.data;
    },
    enabled: isEnabled ?? true,
    meta: {
      handleError: handleHttpError,
    },
  });
};

export const getInvoiceById = async (invoiceId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.get<GetInvoiceByIdResponse>(`/invoices/${invoiceId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const useGetInvoiceById = (invoiceId: string, enabled?: boolean) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.invoice, invoiceId],
    queryFn: async () => getInvoiceById(invoiceId),
    meta: {
      handleError: handleHttpError,
    },
    enabled: enabled ?? true,
  });
};

// Delete invoice by ID
export const deleteInvoice = async (invoiceId: string) => {
  const response = await http.delete(`/invoices/${invoiceId}`);
  return response.data;
};

export const useDeleteInvoice = () => {
  return useMutation({
    mutationFn: (invoiceId: string) => deleteInvoice(invoiceId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKey.invoices] });
    },
  });
};
