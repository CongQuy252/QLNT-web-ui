import { Building2, Home, MapPin, Pencil, Trash2 } from 'lucide-react';
import { BsBuildingAdd } from 'react-icons/bs';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirmDialog/ConfirmDialog';
import { InfoDialog } from '@/components/ui/infoDialog/InfoDialog';
import { Path, RoomStatus } from '@/constants/appConstants';
import { useBuildings } from '@/pages/buildings/useBuildings';
import CreateOrUpdateBuildingDialog from '@/pages/dialogs/createOrUpdateBuildingDialog/CreateOrUpdateBuildingDialog';

const Buildings = () => {
  const {
    confirmOpen,
    confirmMessage,
    setConfirmOpen,
    handleConfirmDelete,
    handleAskDeleteBuilding,
    infoOpen,
    infoMessage,
    setInfoOpen,
    isDeleting,
    handleEditBuilding,
    handleNewBuilding,
    handleSave,
    isOpen,
    editingBuilding,
    setIsOpen,
    isEditMode,
    setSelectedBuilding,
    selectedBuilding,
    building,
    buildings,
    isSaving,
    handleClickRoomStatusCount,
  } = useBuildings();

  const renderRoomStatusCount = () => {
    const statusConfig = [
      {
        label: 'Cho thuê',
        value: building?.roomStatus?.occupied,
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        number: 'text-green-600',
        icon: 'text-green-600',
        status: RoomStatus.occupied,
      },
      {
        label: 'Trống',
        value: building?.roomStatus?.available,
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        number: 'text-blue-600',
        icon: 'text-blue-600',
        status: RoomStatus.available,
      },
      {
        label: 'Bảo trì',
        value: building?.roomStatus?.maintenance,
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        number: 'text-yellow-600',
        icon: 'text-yellow-600',
        status: RoomStatus.maintenance,
      },
    ];

    return statusConfig.map((status) => (
      <div
        key={status.label}
        className={`p-3 rounded-lg border h-full flex flex-col justify-between cursor-pointer ${status.bg} ${status.border}`}
        onClick={() => handleClickRoomStatusCount(`${building?.id}/${Path.rooms}`, status.status)}
      >
        <div className="flex items-center gap-2 mb-1">
          <Home className={`h-4 w-4 shrink-0 ${status.icon}`} />
          <span className={`text-sm ${status.text}`}>{status.label}</span>
        </div>

        <div className={`text-2xl font-bold ${status.number}`}>{status.value}</div>
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Quản lý Tòa Nhà</h1>
          <p className="text-slate-600">Quản lý thông tin và thống kê tòa nhà</p>
        </div>
        <Button
          onClick={handleNewBuilding}
          className="gap-2"
          icon={<BsBuildingAdd className="h-4 w-4" />}
        />
      </div>

      <CreateOrUpdateBuildingDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isEditMode={isEditMode}
        handleSave={handleSave}
        building={editingBuilding}
        isSaving={isSaving}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        <div className="lg:col-span-1 h-full min-h-0">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách Tòa Nhà</CardTitle>
            </CardHeader>

            <CardContent className="px-3 flex-1 min-h-0 space-y-2 overflow-y-auto scrollbar-hide">
              {buildings.map((building) => (
                <button
                  key={building.id}
                  onClick={() => setSelectedBuilding(building.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                    selectedBuilding === building.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-slate-50 border-2 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium text-slate-900">{building.name}</div>
                  <div className="text-sm text-slate-600 whitespace-break-spaces">
                    {building.district}, {building.city}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 h-full overflow-y-auto pr-1">
          {building ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{building.name}</CardTitle>
                        <CardDescription className="mt-1 text-base">
                          {building.district}, {building.city}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditBuilding(building)}
                        className="gap-1"
                        icon={<Pencil className="h-4 w-4" />}
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700 bg-transparent"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => {
                          setSelectedBuilding(building.id);
                          handleAskDeleteBuilding();
                        }}
                        disabled={isDeleting}
                      />
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thông tin Tòa Nhà</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`grid grid-cols-${building.yearBuilt ? 2 : 1} gap-4`}>
                      <div>
                        <div className="text-sm text-slate-600">Địa Chỉ</div>
                        <div className="font-medium text-slate-900 flex items-center gap-2 mt-1 whitespace-break-spaces">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          {building.address}, {building.district}, {building.city}
                        </div>
                      </div>
                      {building.yearBuilt && (
                        <div>
                          <div className="text-sm text-slate-600">Năm Xây Dựng</div>
                          <div className="font-medium text-slate-900">{building.yearBuilt}</div>
                        </div>
                      )}
                    </div>
                    {building.description && (
                      <div className="pt-4 border-t">
                        <div className="text-sm text-slate-600 mb-2">Mô Tả</div>
                        <div className="text-slate-900 whitespace-break-spaces">
                          {building.description}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Thống Kê Phòng (Tổng số phòng: {building.totalRooms})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">{renderRoomStatusCount()}</div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Chọn một tòa nhà để xem chi tiết</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {confirmOpen && (
        <ConfirmDialog
          open={confirmOpen}
          description={confirmMessage}
          confirmText="Xoá"
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

      {infoOpen && (
        <InfoDialog open={infoOpen} message={infoMessage} onClose={() => setInfoOpen(false)} />
      )}
    </div>
  );
};

export default Buildings;
