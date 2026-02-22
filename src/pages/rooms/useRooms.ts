import { useEffect, useMemo, useState } from 'react';

import { useGetBuildingById } from '@/api/building';
import { useGetRoomsQueries, useUpdateRoomMutation } from '@/api/room';
import { RoomStatus } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import { room } from '@/pages/roomDetails/mockData/data';
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRoom>();
  const [openAddTenant, setopenAddTenant] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const filteredRooms = rooms.filter((room: Room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === RoomStatus.all || room.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const tenants: UserRoom[] = [
    {
      _id: '65d8f3c2a12b3c0012345678',
      email: 'nguyenquy@example.com',
      name: 'Nguyen Quy',
      role: 1,
      phone: '0912345678',
      cccd: '079203001234',
      cccdImages: {
        front: {
          url: 'https://cdn.example.com/cccd/front1.jpg',
          publicId: 'cccd/front1',
        },
        back: {
          url: 'https://cdn.example.com/cccd/back1.jpg',
          publicId: 'cccd/back1',
        },
      },
    },
    {
      _id: '65d8f3c2a12b3c0098765432',
      email: 'tenant2@example.com',
      name: 'Tran Van A',
      role: 1,
      phone: '0987654321',
      cccd: '079203009999',
      cccdImages: {
        front: {
          url: 'https://cdn.example.com/cccd/front2.jpg',
          publicId: 'cccd/front2',
        },
        back: {
          url: 'https://cdn.example.com/cccd/back2.jpg',
          publicId: 'cccd/back2',
        },
      },
    },
  ];

  const filteredUsers = tenants?.filter((u) => u.phone.includes(phoneSearch));

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
            setEditRoom(null);
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

  const handleAskDeleteRoom = () => {
    if (!room) {
      return;
    }

    setConfirmMessage('Bạn có chắc muốn xoá phòng này ?');
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!room) {
      return;
    }

    // await deleteBuildingMutation.mutateAsync(building._id);
    // queryClient.invalidateQueries({ queryKey: [QueriesKey.buildings] });
    console.log('room deleted');
    setConfirmOpen(false);
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
  };
};
