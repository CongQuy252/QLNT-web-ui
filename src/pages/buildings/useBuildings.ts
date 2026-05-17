import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useGetBuildingQueries,
  useSearchBuildingQuery,
  useUpdateBuildingMutation,
} from '@/api/building';
import { Operator, QueriesKey, RoomStatus } from '@/constants/appConstants';
import { useAuthUser } from '@/hooks/useCurrentUser';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import type { Building } from '@/types/building';

export const useBuildings = () => {
  const navigator = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, user, isManager } = useAuthUser();

  const getBuildingForAdmin = useGetBuildingQueries(
    {
      limit: 100,
      page: 0,
      searchCondition: { name: undefined, address: undefined },
    },
    isAdmin,
  );

  const getBuildingForManager = useSearchBuildingQuery(
    {
      page: 1,
      limit: 100,
      conditions: [
        {
          fieldName: '_id',
          searchValue: user?.assignBuilding ?? [],
          operator: Operator.in,
        },
      ],
    },
    isManager,
  );

  const getBuildingQueries = useMemo(
    () => (isAdmin ? getBuildingForAdmin : getBuildingForManager),
    [isAdmin, getBuildingForAdmin, getBuildingForManager],
  );

  const createBuildingMutation = useCreateBuildingMutation();
  const updateBuildingMutation = useUpdateBuildingMutation();
  const deleteBuildingMutation = useDeleteBuildingMutation();

  const [selectedBuilding, setSelectedBuilding] = useState<string>();
  const [editingBuilding, setEditingBuilding] = useState<Building>();
  const [confirmMessage, setConfirmMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const buildings = useMemo(() => {
    return (
      getBuildingQueries.data?.data.map((b) => ({
        ...b,
        id: b._id,
      })) ?? []
    );
  }, [getBuildingQueries.data?.data]);

  const handleNewBuilding = () => {
    navigator('/buildings/create');
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
        const occupiedRooms = editingBuilding.roomStatus?.occupied ?? 0;

        if (occupiedRooms > 0) {
          setInfoMessage(
            `Không thể cập nhật "${editingBuilding.name}" vì còn ${occupiedRooms} phòng đang có người thuê. Vui lòng chuyển hết người thuê trước khi cập nhật.`,
          );
          setInfoOpen(true);
          return;
        }

        await updateBuildingMutation.mutateAsync({
          id: editingBuilding._id,
          data,
        });
      } else {
        const payload = {
          ...data,
          area: data.defaultArea,
        };

        await createBuildingMutation.mutateAsync(payload);
      }

      queryClient.invalidateQueries({ queryKey: [QueriesKey.buildings] });
      queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
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
      setSelectedBuilding(undefined);
      setConfirmOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickRoomStatusCount = (path: string, status: RoomStatus) => {
    navigator(path, {
      state: { status },
    });
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
    handleClickRoomStatusCount,
    isAdmin,
  };
};
