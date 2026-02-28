import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetBuildingById } from '@/api/building';
import { useGetRoomsQueries, useUpdateRoomMutation, useAssignTenantMutation, useDeleteRoomMutation, useRemoveTenantMutation } from '@/api/room';
import { useNonTenantUsersQuery } from '@/api/user';
import { QueriesKey, RoomStatus } from '@/constants/appConstants';
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
  const [filterStatus, setFilterStatus] = useState<RoomStatus>(RoomStatus.all);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { data, isLoading, error } = useGetRoomsQueries(currentPage, pageSize, debouncedSearchTerm, filterStatus);
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
  const filteredRooms = rooms;
  const { buildingId } = useParams(); //Nếu có buildingId thì lọc theo buildingId và status (status được truyền trong state) - tham khảo useBuildings - handleClickRoomStatusCount
  console.log('buildingId: ', buildingId);

  const filteredUsers = tenants;

  const handleEditRoom = (room: Room) => {
    setEditRoom(room);
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
