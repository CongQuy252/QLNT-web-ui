import { useQuery } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { http } from '@/lib/axios';
import type { GetUserResponse } from '@/types/user';

export const useUserQuery = (userId?: string) => {
  return useQuery({
    queryKey: [QueriesKey.user, userId],
    queryFn: async () => {
      const response = await http.get<GetUserResponse>(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};
