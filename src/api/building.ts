import { useMutation, useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { http } from '@/lib/axios';
import type { BuildingListResponse } from '@/types/building';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';

export const useGetBuildingQueries = (isEnabled = true) => {
  return useQuery({
    queryKey: [QueriesKey.buildings],
    queryFn: async () => {
      const response = await http.get<BuildingListResponse>(`/buildings`);
      return response.data.data;
    },
    enabled: isEnabled,
  });
};

export const useCreateBuildingMutation = () => {
  return useMutation({
    mutationFn: async (data: BuildingFormInput) => {
      const response = await http.post('/buildings', data);
      return response.data;
    },
  });
};

export const useUpdateBuildingMutation = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BuildingFormInput }) => {
      const response = await http.put(`/buildings/${id}`, data);
      return response.data;
    },
  });
};

export const useDeleteBuildingMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await http.delete(`/buildings/${id}`);
      return response.data;
    },
  });
};
