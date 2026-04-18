import { useMutation, useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import type { Building, BuildingListResponse, GetBuildingByIdResponse } from '@/types/building';

// Simple API function for direct usage
export const getBuildings = async (): Promise<Building[]> => {
  try {
    const response = await http.get<BuildingListResponse>('/buildings');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const useGetBuildingQueries = (isEnabled = true) => {
  return useQuery({
    queryKey: [QueriesKey.buildings],
    queryFn: async () => {
      const response = await http.get<BuildingListResponse>(`/buildings`);
      return response.data;
    },
    enabled: isEnabled,
  });
};

export const useGetBuildingById = (buildingId?: string, isEnable = true) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.building, buildingId],
    queryFn: async () => {
      const response = await http.get<GetBuildingByIdResponse>(`/buildings/${buildingId}`);
      return response.data;
    },
    meta: {
      handleError: handleHttpError,
    },
    enabled: isEnable || !!buildingId,
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
