import { useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { GetTenantListResponse } from '@/types/user';

export const useGetTenantQueries = (enable?: boolean) => {
  const handleHttpError = useHandleHttpError();

  return useQuery({
    queryKey: [QueriesKey.users],
    queryFn: async () => {
      const response = await http.get<GetTenantListResponse>(`/users`);
      return response.data;
    },
    enabled: enable,
    meta: { handleError: handleHttpError },
  });
};
