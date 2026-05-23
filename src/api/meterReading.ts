import { useMutation, useQueryClient } from '@tanstack/react-query';

import { http } from '@/lib/axios';
import type { BulkMeterReadingDto, BulkMeterReadingResponse } from '@/types/meterReading';

export const useBulkUpsertMeterReadings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkMeterReadingDto) => {
      const response = await http.post<BulkMeterReadingResponse>('/meter-readings/bulk', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meter-readings'] });
    },
  });
};
