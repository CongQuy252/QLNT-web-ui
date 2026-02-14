import { useMutation, useQuery } from '@tanstack/react-query';
import { AppConst, QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { GetUserByIdResponse, LoginRequest, LoginResponse } from '@/types/user';

export const useUserQuery = (userId?: string) => {
  return useQuery({
    queryKey: [QueriesKey.user, userId],
    queryFn: async () => {
      const response = await http.get<GetUserByIdResponse>(`/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
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
      localStorage.setItem(AppConst.token, res.token);
      localStorage.setItem(AppConst.userid, res.user.id);
    },
    onError: handleHttpError,
  });
}
