import { useMutation, useQuery } from '@tanstack/react-query';

import { QueriesKey, TenantStatus } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { GetTenantListResponse } from '@/types/tenant';

export interface GetAllTenantsParams {
  status?: TenantStatus;
  userId?: string;
  roomId?: string;
  page?: number;
  limit?: number;
}

export const useGetTenantQueries = (params?: GetAllTenantsParams, enable?: boolean) => {
  const handleHttpError = useHandleHttpError();

  return useQuery({
    queryKey: [QueriesKey.users, params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (params?.status && params.status !== TenantStatus.all) {
        queryParams.append('status', params.status);
      }
      
      if (params?.userId) {
        queryParams.append('userId', params.userId);
      }
      
      if (params?.roomId) {
        queryParams.append('roomId', params.roomId);
      }
      
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      const url = queryParams.toString() ? `/tenants?${queryParams.toString()}` : '/tenants';
      const response = await http.get<GetTenantListResponse>(url);
      return response.data;
    },
    enabled: enable,
    meta: { handleError: handleHttpError },
  });
};

export const useGetTenantByIdQuery = (tenantId: string, enable?: boolean) => {
  const handleHttpError = useHandleHttpError();

  return useQuery({
    queryKey: [QueriesKey.users, 'byUserId', tenantId],
    queryFn: async () => {
      const response = await http.get<GetTenantListResponse>(`/tenants?userId=${tenantId}&limit=1`);
      return response.data.data[0];
    },
    enabled: enable && !!tenantId,
    meta: { handleError: handleHttpError },
  });
};

export const useUpdateTenantMutation = () => {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await http.put(`/tenants/${id}`, data);
      return response.data;
    },
    onError: handleHttpError,
  });
};
