import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { http } from '@/lib/axios';
import type {
  BulkMeterReadingDto,
  BulkMeterReadingResponse,
  CreateMeterReadingDto,
  IMeterReading,
  MeterReadingResponse,
  UpdateMeterReadingDto,
} from '@/types/meterReading';

// Get all meter readings with filters
export const useMeterReadings = (
  roomId?: string,
  buildingId?: string,
  month?: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery<MeterReadingResponse>({
    queryKey: ['meterReadings', roomId, buildingId, month, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (roomId) params.append('roomId', roomId);
      if (buildingId) params.append('buildingId', buildingId);
      if (month) params.append('month', month);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await http.get(`/meter-readings?${params.toString()}`);

      // Handle response format: { message, data: [...], pagination }
      if (response.data.data && response.data.pagination) {
        return {
          meterReadings: response.data.data,
          pagination: response.data.pagination,
        };
      }

      throw new Error('Invalid response format');
    },
    enabled: true,
  });
};

export const useMeterReading = (id: string) => {
  return useQuery<IMeterReading>({
    queryKey: ['meterReading', id],
    queryFn: async () => {
      const response = await http.get(`/meter-readings/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateMeterReading = () => {
  const queryClient = useQueryClient();

  return useMutation<IMeterReading, Error, CreateMeterReadingDto>({
    mutationFn: async (data: CreateMeterReadingDto) => {
      const response = await http.post('/meter-readings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meterReadings'] });
    },
  });
};

export const useUpdateMeterReading = () => {
  const queryClient = useQueryClient();

  return useMutation<IMeterReading, Error, { id: string; data: UpdateMeterReadingDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await http.put(`/meter-readings/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meterReadings'] });
    },
  });
};

export const useDeleteMeterReading = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id: string) => {
      await http.delete(`/meter-readings/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meterReadings'] });
    },
  });
};

export const bulkUpsertMeterReadings = async (
  data: BulkMeterReadingDto,
): Promise<BulkMeterReadingResponse> => {
  const response = await http.post('/meter-readings/bulk', data);
  return response.data;
};
