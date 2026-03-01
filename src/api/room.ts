import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { PutRoomRequest, PutRoomResponse, Room, RoomListResponse, GetRoom } from '@/types/room';

export const useGetRoomsQueries = (page = 1, limit = 10, search = '', status = '', isEnabled = true) => {
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
      const rooms: Room[] =
        response.data.rooms?.map((room) => ({
          _id: room._id,
          number: room.number,
          buildingId: room.buildingId,
          floor: room.floor,
          area: room.area,
          price: room.price,
          electricityUnitPrice: room.electricityUnitPrice,
          waterUnitPrice: room.waterUnitPrice,
          internetFee: room.internetFee,
          parkingFee: room.parkingFee,
          serviceFee: room.serviceFee,
          status: room.status,
          currentTenant: room.currentTenant
            ? {
                _id: room.currentTenant._id,
                name: room.currentTenant.name ?? '',
                email: room.currentTenant.email ?? '',
              }
            : undefined,
          description: room.description,
          createdAt: room.createdAt || new Date().toISOString(),
          updatedAt: room.updatedAt || new Date().toISOString(),
        })) || [];

      return {
        rooms,
        pagination: response.data.pagination,
      };
    },
    enabled: isEnabled,
    meta: { handleError: handleHttpError },
    placeholderData: (prev) => prev,
  });
};

export const useGetOccupiedRoomsQueries = (page = 1, limit = 10, buildingId = '', floor?: number, isEnabled = true) => {
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
      const response = await http.get<GetRoom>(`/rooms/${roomId}`);
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
        data: { buildingId }
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
