import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueriesKey, RoomStatus } from '@/constants/appConstants';
import { http } from '@/lib/axios';
import type { RoomListResponse } from '@/types/room';

export const useGetRoomsQueries = (page = 1, limit = 10, isEnabled = true) => {
  return useQuery({
    queryKey: [QueriesKey.rooms, page, limit],
    queryFn: async () => {
      const response = await http.get<RoomListResponse>(`/rooms?page=${page}&limit=${limit}`);
      // Transform backend data to match frontend Room type
      const rooms = (response.data as any).rooms?.map((room: any) => ({
        id: room._id,
        number: room.number,
        building: room.buildingId?.name || '',
        buildingId: room.buildingId?._id || '',
        floor: room.floor,
        area: room.area,
        price: room.price,
        status: room.status === 'available' ? RoomStatus.available :
                room.status === 'maintenance' ? RoomStatus.maintenance :
                room.status === 'occupied' ? RoomStatus.occupied : RoomStatus.available,
        images: [],
        currentTenant: undefined,
        description: room.description || undefined,
      })) || [];
      return {
        rooms,
        pagination: (response.data as any).pagination
      };
    },
    enabled: isEnabled,
  });
};

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await http.put(`/rooms/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch rooms data
      queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
    },
  });
};
