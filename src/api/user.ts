import { queryClient } from '@/lib/reactQuery';
import { useMutation, useQuery } from '@tanstack/react-query';

import { LocalStorageKey, QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type {
  GetAllUserRequest,
  GetNonTenantUsersRequest,
  GetNonTenantUsersResponse,
  GetTenantListResponse,
  GetUserByIdResponse,
  LoginRequest,
  LoginResponse,
} from '@/types/user';

export const useUserByIdQuery = (userId?: string, enable?: boolean) => {
  return useQuery({
    queryKey: [QueriesKey.user, userId],
    queryFn: async () => {
      const response = await http.get<GetUserByIdResponse>(`/users/${userId}`);
      return response.data.data;
    },
    enabled: enable || !!userId,
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
      const response = await http.get<GetTenantListResponse>('/users', {
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

export const useNonTenantUsersQuery = (params?: GetNonTenantUsersRequest, enabled?: boolean) => {
  return useQuery({
    queryKey: [QueriesKey.users, params],
    queryFn: async () => {
      const response = await http.get<GetNonTenantUsersResponse>('/users/non-tenants', { params });
      return response.data;
    },
    enabled,
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
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await http.put('/auth/change-password', data);
      return response.data;
    },
    onError: handleHttpError,
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
