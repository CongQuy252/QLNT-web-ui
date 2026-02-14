import { useState } from 'react';

import { RoomStatus } from '@/constants/appConstants';
import { buildings } from '@/pages/buildings/mockData/building';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import { rooms } from '@/pages/rooms/data/roomMockData';
import type { Building } from '@/types/building';
import type { Room } from '@/types/room';

export const useBuildings = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building>();

  const handleNewBuilding = () => {
    setIsEditMode(false);
    setEditingBuilding(undefined);
    setIsOpen(true);
  };

  const handleEditBuilding = (building: Building) => {
    setIsEditMode(true);
    setEditingBuilding(building);
    setSelectedBuilding(building.id);
    setIsOpen(true);
  };

  const handleSave = async (data: BuildingFormInput) => {
    if (isEditMode && editingBuilding) {
      console.log('Update building', {
        id: editingBuilding.id,
        ...data,
      });
    } else {
      console.log('Create new building', data);
    }

    setIsOpen(false);
  };

  const building = selectedBuilding ? buildings.find((b) => b.id === selectedBuilding) : null;

  const getRoomsByBuilding = (buildingId: string): Room[] => {
    const buildingName = buildings.find((b) => b.id === buildingId)?.name;
    return rooms.filter((r) => r.building === buildingName?.charAt(buildingName.length - 1));
  };

  const buildingRooms = building ? getRoomsByBuilding(building.id) : [];
  const occupiedRooms = buildingRooms.filter((r) => r.status === RoomStatus.occupied).length;
  const availableRooms = buildingRooms.filter((r) => r.status === RoomStatus.available).length;
  const maintenanceRooms = buildingRooms.filter((r) => r.status === RoomStatus.maintenance).length;

  const handleBuildingDelete = () => {
    if (building) {
      console.log('Delete building', building.id);
      setSelectedBuilding(null);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isEditMode,
    editingBuilding,
    handleNewBuilding,
    handleEditBuilding,
    handleSave,
    occupiedRooms,
    availableRooms,
    maintenanceRooms,
    handleBuildingDelete,
    setSelectedBuilding,
    selectedBuilding,
    building,
  };
};
