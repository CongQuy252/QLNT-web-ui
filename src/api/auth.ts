import { useMutation } from '@tanstack/react-query';

import { LocalStorageKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { LoginRequest, LoginResponse } from '@/types/user';

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
