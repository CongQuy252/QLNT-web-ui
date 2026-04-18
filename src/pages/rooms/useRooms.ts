import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useDeleteRoomMutation, useGetRoomsQueries } from '@/api/room';
import { debounceTime } from '@/constants/appConstants';
import type { Room } from '@/types/room';

export const useRooms = () => {
  const location = useLocation();
  const params = useParams();
  const { status } = location.state || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>(status ?? '0');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;
  const [roomSelected, setRoomSelected] = useState<Room>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { data, isLoading, error } = useGetRoomsQueries({
    initialPage: currentPage,
    initialLimit: pageSize,
    search: debouncedSearchTerm,
    status: filterStatus,
    buildingId: params.buildingId || '',
  });

  const rooms = data?.rooms || [];
  const pagination = data?.pagination;
  const deleteRoomMutation = useDeleteRoomMutation();
  const filteredRooms = rooms.map((room) => {
    const buildingId =
      typeof room.buildingId === 'object' && room.buildingId !== null
        ? room.buildingId._id
        : room.buildingId;

    return {
      ...room,
      buildingId: buildingId,
      buildingName:
        room.buildingId && typeof room.buildingId === 'object' ? room.buildingId.name : '',
    };
  });

  const totalItems = useMemo(() => pagination?.total ?? 0, [pagination]);

  const handleAskDeleteRoom = (room: Room) => {
    if (!room) {
      return;
    }
    setRoomSelected(room);
    setConfirmMessage(`Bạn có chắc muốn xoá phòng ${room.number}`);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roomSelected) {
      return;
    }

    try {
      await deleteRoomMutation.mutateAsync({
        roomId: roomSelected._id,
        buildingId: roomSelected.buildingId || '',
      });

      setConfirmOpen(false);
      setRoomSelected(undefined);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return {
    totalItems,
    isLoading,
    error,
    filteredRooms,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    setCurrentPage,
    deleteRoomMutation,
    setConfirmOpen,
    handleConfirmDelete,
    confirmMessage,
    confirmOpen,
    handleAskDeleteRoom,
    setRoomSelected,
    roomSelected,
  };
};
