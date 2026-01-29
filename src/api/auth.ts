import { useMutation } from '@tanstack/react-query';

import { AppConst } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { LoginRequest, LoginResponse } from '@/types/user';

export function useLoginMutation() {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await http.post<LoginResponse>('/login', data);
      return response.data;
    },
    onSuccess: (res) => {
      localStorage.setItem(AppConst.token, res.access_token);
      localStorage.setItem(AppConst.userid, res.user.id);
    },
    onError: handleHttpError,
  });
}
