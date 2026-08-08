import { queryClient } from '@/lib/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';

import axios, { AxiosError, HttpStatusCode } from 'axios';
import { useSnackbar } from 'notistack';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { GetAllUserRequest, GetUserByIdResponse, GetUserListResponse } from '@/types/user';

export const useUserByIdQuery = (userId?: string, enable?: boolean) => {
  const handleHttpError = useHandleHttpError();
  const { enqueueSnackbar } = useSnackbar();

  return useQuery({
    queryKey: [QueriesKey.user, userId],
    queryFn: async () => {
      const response = await http.get<GetUserByIdResponse>(`/users/${userId}`);
      return response.data.data;
    },
    enabled: enable || !!userId,
    meta: {
      handleError: (error: Error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            return;
          } else if (error.response?.status === 403) {
            enqueueSnackbar('Người dùng không có quyền trong hệ thống', { variant: 'error' });
            return;
          }
        }

        return handleHttpError(error);
      },
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useUsersQuery = (condition: GetAllUserRequest, enable?: boolean) => {
  const handleHttpError = useHandleHttpError();
  const { page, limit, searchCondition } = condition;

  return useQuery({
    queryKey: [
      QueriesKey.users,
      page,
      limit,
      searchCondition.email,
      searchCondition.name,
      searchCondition.phone,
    ],

    queryFn: async () => {
      const response = await http.get<GetUserListResponse>('/users', {
        params: {
          page,
          limit,
          email: searchCondition.email,
          name: searchCondition.name,
          phone: searchCondition.phone,
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

export const useCreateUserMutation = () => {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await http.post('/users/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onError: handleHttpError,
  });
};

export const useChangePasswordMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await http.put('/auth/change-password', data);
      return response.data;
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === HttpStatusCode.BadRequest) {
          enqueueSnackbar('Mật khẩu cũ không chính xác', { variant: 'error' });
        } else {
          enqueueSnackbar('Có lỗi xảy ra khi đổi mật khẩu', { variant: 'error' });
        }
      } else {
        handleHttpError(error);
      }
    },
  });
};

export const useUpdateUserMutation = () => {
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (req: { userId: string; data: FormData }) => {
      const { userId, data } = req;
      const response = await http.put(`/users/${userId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKey.users] });
    },
    onError: handleHttpError,
  });
};
