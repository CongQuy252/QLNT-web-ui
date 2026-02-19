import { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useGetBuildingQueries, useCreateBuildingMutation, useUpdateBuildingMutation, useDeleteBuildingMutation } from '@/api/building';
import { QueriesKey } from '@/constants/appConstants';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import type { Building } from '@/types/building';

export const useBuildings = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building>();
  const queryClient = useQueryClient();
  const getBuildingQueries = useGetBuildingQueries();
  const createBuildingMutation = useCreateBuildingMutation();
  const updateBuildingMutation = useUpdateBuildingMutation();
  const deleteBuildingMutation = useDeleteBuildingMutation();

  const buildings = useMemo(() => {
    return (
      getBuildingQueries.data?.map((b) => ({
        ...b,
        id: b._id,
      })) ?? []
    );
  }, [getBuildingQueries.data]);

  const handleNewBuilding = () => {
    setIsEditMode(false);
    setEditingBuilding(undefined);
    setIsOpen(true);
  };

  const handleEditBuilding = (building: Building) => {
    setIsEditMode(true);
    setEditingBuilding(building);
    setSelectedBuilding(building._id);
    setIsOpen(true);
  };

  const handleSave = async (data: BuildingFormInput) => {
    try {
      if (isEditMode && editingBuilding) {
        await updateBuildingMutation.mutateAsync({
          id: editingBuilding._id,
          data,
        });
      } else {
        await createBuildingMutation.mutateAsync(data);
      }
      
      queryClient.invalidateQueries({ queryKey: [QueriesKey.buildings] });
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving building:', error);
    }
  };

  const building = selectedBuilding ? buildings.find((b) => b.id === selectedBuilding) : undefined;

  // Chỉ sử dụng roomStatus từ API, không dùng mock data
  const occupiedRooms = building?.roomStatus?.occupied ?? 0;
  const availableRooms = building?.roomStatus?.available ?? 0;
  const maintenanceRooms = building?.roomStatus?.maintenance ?? 0;

  const handleBuildingDelete = async () => {
    if (!building) return;

    // Chỉ sử dụng roomStatus từ API
    const totalRooms = building.roomStatus ? 
      (building.roomStatus.available + building.roomStatus.occupied + building.roomStatus.maintenance) : 0;
    
    const occupiedRooms = building.roomStatus?.occupied ?? 0;
    
    if (totalRooms > 0) {
      if (occupiedRooms > 0) {
        alert(`Không thể xóa tòa nhà "${building.name}" vì vẫn còn ${occupiedRooms} phòng đang có người thuê. Vui lòng xử lý hết các hợp đồng thuê trước khi xóa.`);
        return;
      }
      
      // Có phòng nhưng không có người thuê
      const confirmDelete = confirm(`Tòa nhà "${building.name}" có ${totalRooms} phòng nhưng chưa có người thuê. Bạn có chắc chắn muốn xóa?`);
      if (!confirmDelete) return;
    } else {
      // Không có phòng nào
      const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa tòa nhà "${building.name}"?`);
      if (!confirmDelete) return;
    }

    try {
      await deleteBuildingMutation.mutateAsync(building._id);
      queryClient.invalidateQueries({ queryKey: [QueriesKey.buildings] });
      setSelectedBuilding(null);
    } catch (error) {
      console.error('Error deleting building:', error);
      alert('Xóa tòa nhà thất bại. Vui lòng thử lại.');
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
    buildings,
    isSaving: createBuildingMutation.isPending || updateBuildingMutation.isPending,
    isDeleting: deleteBuildingMutation.isPending,
  };
};
