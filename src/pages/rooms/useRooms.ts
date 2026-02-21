import { useState } from 'react';

import { RoomStatus } from '@/constants/appConstants';
import { rooms } from '@/pages/rooms/data/roomMockData';
import type { Room } from '@/types/room';

export const useRooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<RoomStatus>(RoomStatus.all);
  const [isOpenViewImageDialog, setIsOpenViewImageDialog] = useState<boolean>(false);
  const [list, setList] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  const [newRoom, setNewRoom] = useState<Room>({
    id: crypto.randomUUID(),
    number: '',
    building: 'A',
    floor: 1,
    area: 0,
    price: 0,
    status: RoomStatus.available,
    images: [],
    currentTenant: undefined,
    description: '',
  });

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === RoomStatus.all || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialogViewImage = (listImage: string[]) => {
    setIsOpenViewImageDialog(true);
    setList(listImage);
  };

  const handleCloseDialogViewImage = () => {
    setIsOpenViewImageDialog(false);
    setList([]);
  };

  const handleAddRoom = () => {
    alert('Addroom');
  };

  return {
    totalRoom: rooms.length,
    handleAddRoom,
    handleCloseDialogViewImage,
    handleOpenDialogViewImage,
    filteredRooms,
    newRoom,
    setNewRoom,
    isAddDialogOpen,
    setIsAddDialogOpen,
    list,
    isOpenViewImageDialog,
    setFilterStatus,
    setSearchTerm,
    filterStatus,
    searchTerm,
  };
};
