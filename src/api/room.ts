import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueriesKey } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { GetRoomByIdResponse, PutRoomRequest, PutRoomResponse, RoomListResponse } from '@/types/room';
import type { RoomsWithMeterReadingsResponse } from '@/types/room';
export type { RoomWithMeterReading, RoomsWithMeterReadingsResponse } from '@/types/room';

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
    queryKey: [QueriesKey.occupiedRooms, page, limit, buildingId, floor],
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

export const useRoomsWithMeterReadings = (
  month: number,
  year: number,
  searchParams?: {
    buildingId?: string;
    floor?: number;
    buildingName?: string;
    roomNumber?: string;
  },
  pagination?: {
    page?: number;
    limit?: number;
  },
) => {
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;

  return useQuery<RoomsWithMeterReadingsResponse>({
    queryKey: ['roomsWithMeterReadings', month, year, searchParams?.buildingId, searchParams?.floor, searchParams?.buildingName, searchParams?.roomNumber, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('month', month.toString());
      params.append('year', year.toString());
      
      if (searchParams?.buildingId) {
        params.append('buildingId', searchParams.buildingId);
      }
      
      if (searchParams?.floor !== undefined) {
        params.append('floor', searchParams.floor.toString());
      }
      
      if (searchParams?.buildingName) {
        params.append('buildingName', searchParams.buildingName);
      }
      
      if (searchParams?.roomNumber) {
        params.append('roomNumber', searchParams.roomNumber);
      }
      
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await http.get(`/rooms/meter-reading?${params.toString()}`);
      
      return response.data;
    },
    enabled: !!month && !!year,
  });
};