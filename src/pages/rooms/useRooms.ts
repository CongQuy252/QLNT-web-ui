import { useState } from 'react';

import { useGetRoomsQueries, useUpdateRoomMutation } from '@/api/room';
import { RoomStatus } from '@/constants/appConstants';
import type { Room } from '@/types/room';

export const useRooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<RoomStatus>(RoomStatus.all);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const { data, isLoading, error } = useGetRoomsQueries(currentPage, pageSize);
  const rooms = data?.rooms || [];
  const pagination = data?.pagination;
  const updateRoomMutation = useUpdateRoomMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const filteredRooms = rooms.filter((room: Room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === RoomStatus.all || room.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleEditRoom = (room: Room) => {
    setEditRoom(room);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = () => {
    if (editRoom) {
      updateRoomMutation.mutate(
        {
          id: editRoom.id,
          data: {
            number: editRoom.number,
            buildingId: editRoom.buildingId,
            floor: editRoom.floor,
            area: editRoom.area,
            price: editRoom.price,
            status:
              editRoom.status === RoomStatus.available
                ? RoomStatus.available
                : editRoom.status === RoomStatus.maintenance
                  ? RoomStatus.maintenance
                  : editRoom.status === RoomStatus.occupied
                    ? RoomStatus.occupied
                    : RoomStatus.available,
            description: editRoom.description,
          },
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setEditRoom(null);
          },
        },
      );
    }
  };

  return {
    totalItems: pagination?.total ?? 0,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editRoom,
    setEditRoom,
    handleUpdateRoom,
    updateRoomMutation,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    error,
    filteredRooms,
    handleEditRoom,
    pagination,
    currentPage,
    pageSize,
    setCurrentPage,
  };
};
