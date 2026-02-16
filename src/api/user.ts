import { useMutation, useQuery } from '@tanstack/react-query';

import { LocalStorageKey, QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { GetUserByIdResponse, LoginRequest, LoginResponse } from '@/types/user';

export const useUserQuery = (userId?: string, enable?: boolean) => {
  return useQuery({
    queryKey: [QueriesKey.user, userId],
    queryFn: async () => {
      const response = await http.get<GetUserByIdResponse>(`/users/${userId}`);
      return response.data.data;
    },
    enabled: enable || !!userId,
  });
};

export function useLoginMutation() {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await http.post<LoginResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (res) => {
      localStorage.setItem(LocalStorageKey.token, res.token);
      localStorage.setItem(LocalStorageKey.userId, res.user.id);
    },
    onError: handleHttpError,
  });
}
