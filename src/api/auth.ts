import { useMutation } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { LocalStorageKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { LoginRequest, LoginResponse } from '@/types/user';

export function useLoginMutation() {
  const handleHttpError = useHandleHttpError();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await http.post<LoginResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (res) => {
      localStorage.setItem(LocalStorageKey.token, res.token);
      localStorage.setItem(LocalStorageKey.userId, res.user.id);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return;
        } else if (error.response?.status === 403) {
          enqueueSnackbar('Người dùng không có quyền trong hệ thống', { variant: 'error' });
          return;
        }
      }

      return handleHttpError(error);
    },
  });
}
