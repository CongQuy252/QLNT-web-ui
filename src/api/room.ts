import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueriesKey, RoomStatus } from '@/constants/appConstants';
import { useHandleHttpError } from '@/hooks/exceptions/handleHttpError';
import { http } from '@/lib/axios';
import type { PutRoomRequest, PutRoomResponse, Room, RoomListResponse } from '@/types/room';

export const useGetRoomsQueries = (page = 1, limit = 10, isEnabled = true) => {
  const handleHttpError = useHandleHttpError();
  return useQuery({
    queryKey: [QueriesKey.rooms, page, limit],
    queryFn: async () => {
      const response = await http.get<RoomListResponse>(`/rooms?page=${page}&limit=${limit}`);
      const rooms: Room[] =
        response.data.rooms?.map((room) => ({
          _id: room._id,
          number: room.number,
          building: room.buildingId?.name || '',
          buildingId: room.buildingId?._id || '',
          floor: room.floor,
          area: room.area,
          price: room.price,
          status:
            room.status === 'available'
              ? RoomStatus.available
              : room.status === 'maintenance'
                ? RoomStatus.maintenance
                : room.status === 'occupied'
                  ? RoomStatus.occupied
                  : RoomStatus.available,
          currentTenant: room.currentTenant?._id
            ? {
                _id: room.currentTenant._id,
                name: room.currentTenant.name ?? '',
                email: room.currentTenant.email ?? '',
              }
            : undefined,
          description: room.description,
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
