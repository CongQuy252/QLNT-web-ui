import { useMutation, useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import type { Building, BuildingListResponse, GetBuildingByIdResponse } from '@/types/building';

// Simple API function for direct usage
export const getBuildings = async (): Promise<Building[]> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await http.get<BuildingListResponse>('/buildings');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export interface GetAllBuildingRequest {
  page: number;
  limit: number;
  searchCondition: {
    name?: string;
    address?: string;
  };
}

export const useGetBuildingQueries = (condition: GetAllBuildingRequest, enable?: boolean) => {
  const handleHttpError = useHandleHttpError();

  const { page, limit, searchCondition } = condition;

  return useQuery({
    queryKey: [QueriesKey.buildings, page, limit, searchCondition.name, searchCondition.address],

    queryFn: async () => {
      const response = await http.get<BuildingListResponse>('/buildings', {
        params: {
          page,
          limit,
          name: searchCondition.name,
          address: searchCondition.address,
        },
      });

      return response.data;
    },

    meta: {
      handleError: handleHttpError,
    },

    enabled: enable,
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
