import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useGetBuildingQueries,
  useUpdateBuildingMutation,
} from '@/api/building';
import { QueriesKey } from '@/constants/appConstants';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import type { Building } from '@/types/building';

export const useBuildings = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
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

  const handleAskDeleteBuilding = () => {
    if (!building) return;

    const totalRooms = building.roomStatus
      ? building.roomStatus.available +
        building.roomStatus.occupied +
        building.roomStatus.maintenance
      : 0;

    const occupiedRooms = building.roomStatus?.occupied ?? 0;

    if (occupiedRooms > 0) {
      setInfoMessage(
        `Không thể xóa "${building.name}" vì còn ${occupiedRooms} phòng đang có người thuê.`,
      );
      setInfoOpen(true);
      return;
    }

    if (totalRooms > 0) {
      setConfirmMessage(`Tòa nhà có ${totalRooms} phòng chưa có người thuê. Bạn có chắc muốn xóa?`);
    } else {
      setConfirmMessage(`Bạn có chắc chắn muốn xóa "${building.name}"?`);
    }

    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!building) return;

    try {
      await deleteBuildingMutation.mutateAsync(building._id);
      queryClient.invalidateQueries({ queryKey: [QueriesKey.buildings] });
      setSelectedBuilding(null);
      setConfirmOpen(false);
    } catch (error) {
      console.error(error);
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
    confirmOpen,
    confirmMessage,
    setConfirmOpen,
    handleConfirmDelete,
    handleAskDeleteBuilding,
    infoOpen,
    infoMessage,
    setInfoOpen,
    setSelectedBuilding,
    selectedBuilding,
    building,
    buildings,
    isSaving: createBuildingMutation.isPending || updateBuildingMutation.isPending,
    isDeleting: deleteBuildingMutation.isPending,
  };
};
