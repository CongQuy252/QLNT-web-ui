import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetBuildingById } from '@/api/building';
import { useGetRoomsQueries, useUpdateRoomMutation, useAssignTenantMutation } from '@/api/room';
import { useAllUsersQuery } from '@/api/user';
import { RoomStatus } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import type { Room } from '@/types/room';
import type { UserRoom } from '@/types/user';

export const useRooms = () => {
  const { hide, show } = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<RoomStatus>(RoomStatus.all);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const { data, isLoading, error } = useGetRoomsQueries(currentPage, pageSize);
  const rooms = data?.rooms || [];
  const pagination = data?.pagination;
  const updateRoomMutation = useUpdateRoomMutation();
  const assignTenantMutation = useAssignTenantMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editRoom, setEditRoom] = useState<Room>();
  const [roomSelected, setRoomSelected] = useState<Room>();
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRoom>();
  const [openAddTenant, setopenAddTenant] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const { data: usersData } = useAllUsersQuery({ phone: phoneSearch || undefined }, true);
  const tenants = usersData?.data || [];

  const filteredRooms = rooms.filter((room: Room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === RoomStatus.all || room.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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

    // await deleteBuildingMutation.mutateAsync(building._id);
    // queryClient.invalidateQueries({ queryKey: [QueriesKey.buildings] });
    console.log('room deleted');
    setConfirmOpen(false);
  };

  const handleAssignTenant = () => {
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
        },
      }
    );
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
    assignTenantMutation,
    handleAssignTenant,
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
  };
};
