import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type {
  GetRoomByIdResponse,
  PutRoomRequest,
  PutRoomResponse,
  RoomListResponse,
} from '@/types/room';

export const useGetRoomsQueries = ({
  page = 1,
  limit = 10,
  search = '',
  status = '',
  isEnabled = true,
}) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.rooms, page, limit, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append('search', search);
      if (status && status !== '0') params.append('status', status);

      const response = await http.get<RoomListResponse>(`/rooms?${params.toString()}`);

      return {
        rooms: response.data.rooms,
        pagination: response.data.pagination,
      };
    },
    enabled: isEnabled,
    meta: { handleError: handleHttpError },
    placeholderData: (prev) => prev,
  });
};

export const useGetOccupiedRoomsQueries = (
  page = 1,
  limit = 10,
  buildingId = '',
  floor?: number,
  isEnabled = true,
) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: ['occupied-rooms', page, limit, buildingId, floor],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (buildingId) params.append('buildingId', buildingId);
      if (floor !== undefined) params.append('floor', floor.toString());

      const response = await http.get<RoomListResponse>(`/rooms/occupied?${params.toString()}`);
      return response.data;
    },
    enabled: isEnabled,
    meta: { handleError: handleHttpError },
    placeholderData: (prev) => prev,
  });
};

export const useGetRoomByIdQuery = (roomId: string, isEnabled = true) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const response = await http.get<GetRoomByIdResponse>(`/rooms/${roomId}`);
      return response.data;
    },
    enabled: isEnabled && !!roomId,
    meta: { handleError: handleHttpError },
  });
};

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PutRoomRequest }) => {
      const response = await http.put<PutRoomResponse>(`/rooms/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
    },
    onError: handleHttpError,
  });
};

export const useAssignTenantMutation = () => {
  const queryClient = useQueryClient();
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async ({ roomId, userId }: { roomId: string; userId: string }) => {
      const response = await http.post(`/rooms/${roomId}/assign-tenant`, { userId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
    },
    onError: handleHttpError,
  });
};

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async ({ roomId, buildingId }: { roomId: string; buildingId: string }) => {
      const response = await http.delete(`/rooms/${roomId}`, {
        data: { buildingId },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
      queryClient.invalidateQueries({ queryKey: [QueriesKey.buildings] });
    },
    onError: handleHttpError,
  });
};

export const useRemoveTenantMutation = () => {
  const queryClient = useQueryClient();
  const handleHttpError = useHandleHttpError();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await http.post(`/rooms/${roomId}/remove-tenant`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
      queryClient.invalidateQueries({ queryKey: [QueriesKey.users] });
    },
    onError: handleHttpError,
  });
};

export const useGetRoomByUserIDQuery = (userId?: string, isEnabled = true) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.room, userId],
    queryFn: async () => {
      const response = await http.get<GetRoomByIdResponse>(`/rooms/tenant/${userId}`);
      return response.data;
    },
    enabled: isEnabled && !!userId,
    meta: { handleError: handleHttpError },
  });
};
