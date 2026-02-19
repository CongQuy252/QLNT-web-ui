import { useMemo, useState } from 'react';

import { useGetBuildingQueries } from '@/api/building';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import type { Building } from '@/types/building';

export const useBuildings = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building>();
  const getBuildingQueries = useGetBuildingQueries();

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
    if (isEditMode && editingBuilding) {
      console.log('Update building', {
        id: editingBuilding._id,
        ...data,
      });
    } else {
      console.log('Create new building', data);
    }

    setIsOpen(false);
  };

  const building = selectedBuilding ? buildings.find((b) => b.id === selectedBuilding) : undefined;

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
    handleBuildingDelete,
    setSelectedBuilding,
    selectedBuilding,
    building,
    buildings,
  };
};
