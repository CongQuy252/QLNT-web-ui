/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { useGetBuildingById } from '@/api/building';
import {
  useAssignTenantMutation,
  useDeleteRoomMutation,
  useGetRoomsQueries,
  useRemoveTenantMutation,
  useUpdateRoomMutation,
} from '@/api/room';
import { useNonTenantUsersQuery } from '@/api/user';
import { QueriesKey } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { useToast } from '@/hooks/useToast';
import type { Room } from '@/types/room';
import type { UserRoom } from '@/types/user';

export const useRooms = () => {
  const queryClient = useQueryClient();
  const { success } = useToast();
  const { hide, show } = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('0');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { data, isLoading, error } = useGetRoomsQueries(
    currentPage,
    pageSize,
    debouncedSearchTerm,
    filterStatus,
  );
  const rooms = data?.rooms || [];
  const pagination = data?.pagination;
  const updateRoomMutation = useUpdateRoomMutation();
  const assignTenantMutation = useAssignTenantMutation();
  const deleteRoomMutation = useDeleteRoomMutation();
  const removeTenantMutation = useRemoveTenantMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editRoom, setEditRoom] = useState<Room>();
  const [roomSelected, setRoomSelected] = useState<Room>();
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRoom>();
  const [openAddTenant, setopenAddTenant] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [assignConfirmOpen, setAssignConfirmOpen] = useState(false);
  const { data: usersData } = useNonTenantUsersQuery({ phone: phoneSearch || undefined }, true);
  const tenants = usersData?.data || [];
  const filteredRooms = rooms.map((room) => ({
    ...room,
    buildingId: (room.buildingId as any)?._id || room.buildingId,
    buildingName: (room.buildingId as any)?.name || '',
  })) as Room[];

  const filteredUsers = tenants;

  const handleEditRoom = (room: Room) => {
    // Normalize buildingId to always be string
    const normalizedRoom = {
      ...room,
      buildingId: (room.buildingId as any)?._id || room.buildingId,
    };
    setEditRoom(normalizedRoom);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = () => {
    if (editRoom) {
      updateRoomMutation.mutate(
        {
          id: editRoom._id,
          data: {
            number: editRoom.number,
            buildingId: editRoom.buildingId,
            floor: editRoom.floor,
            area: editRoom.area,
            price: editRoom.price,
            electricityUnitPrice: editRoom.electricityUnitPrice,
            waterUnitPrice: editRoom.waterUnitPrice,
            internetFee: editRoom.internetFee,
            parkingFee: editRoom.parkingFee,
            serviceFee: editRoom.serviceFee,
            status: editRoom.status,
            description: editRoom.description,
          },
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setEditRoom(undefined);
          },
        },
      );
    }
  };

  const totalItems = useMemo(() => pagination?.total ?? 0, [pagination]);

  const getBuildingById = useGetBuildingById(editRoom?.buildingId ?? '');

  useEffect(() => {
    if (!getBuildingById.isError && !getBuildingById.isSuccess) {
      show();
    } else {
      hide();
    }
  });

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

      success(`Đã xóa phòng ${roomSelected.number} thành công!`);
      setConfirmOpen(false);
      setRoomSelected(undefined);
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleOpenAddTenant = (room: Room) => {
    setRoomSelected(room);
    setopenAddTenant(true);
  };

  const handleAssignTenant = () => {
    if (!roomSelected || !selectedUser) {
      return;
    }
    setAssignConfirmOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!roomSelected || !selectedUser) {
      return;
    }

    assignTenantMutation.mutate(
      {
        roomId: roomSelected._id,
        userId: selectedUser._id,
      },
      {
        onSuccess: () => {
          setopenAddTenant(false);
          setSelectedUser(undefined);
          setRoomSelected(undefined);
          setAssignConfirmOpen(false);
          // Invalidate lại query users để refresh danh sách
          queryClient.invalidateQueries({ queryKey: [QueriesKey.users] });
          queryClient.invalidateQueries({
            queryKey: [QueriesKey.buildings],
          });
          // Hiển thị thông báo thành công
          success(`Đã gán ${selectedUser.name} vào phòng ${roomSelected.number} thành công!`);
        },
        onError: () => {
          setAssignConfirmOpen(false);
        },
      },
    );
  };

  const handleRemoveTenant = async (room: Room) => {
    if (!room) {
      return;
    }

    try {
      await removeTenantMutation.mutateAsync(room._id);
      success(`Đã gỡ người thuê khỏi phòng ${room.number} thành công!`);
    } catch (error) {
      console.error('Error removing tenant:', error);
    }
  };

  return {
    totalItems,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editRoom,
    setEditRoom,
    handleUpdateRoom,
    updateRoomMutation,
    deleteRoomMutation,
    removeTenantMutation,
    handleOpenAddTenant,
    assignTenantMutation,
    handleAssignTenant,
    handleConfirmAssign,
    handleRemoveTenant,
    assignConfirmOpen,
    setAssignConfirmOpen,
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
    filteredUsers,
    phoneSearch,
    setPhoneSearch,
    selectedUser,
    setSelectedUser,
    openAddTenant,
    setopenAddTenant,
    totalFloors: getBuildingById.data?.data.totalFloors ?? 0,
    setConfirmOpen,
    handleConfirmDelete,
    confirmMessage,
    confirmOpen,
    handleAskDeleteRoom,
    setRoomSelected,
    roomSelected,
  };
};
