import { Building2, Home, MapPin, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RoomStatus } from '@/constants/appConstants';
import { buildings } from '@/pages/buildings/mockData/building';
import CreateOrUpdateBuildingDialog from '@/pages/dialogs/createOrUpdateBuildingDialog/CreateOrUpdateBuildingDialog';
import type { BuildingFormInput } from '@/pages/dialogs/createOrUpdateBuildingDialog/schema/createOrUpdateSchema';
import { rooms } from '@/pages/rooms/data/roomMockData';
import type { Building } from '@/types/building';
import type { Room } from '@/types/room';

const Buildings = () => {
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Quản lý Tòa Nhà</h1>
          <p className="text-slate-600">Quản lý thông tin và thống kê tòa nhà</p>
        </div>
        <CreateOrUpdateBuildingDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isEditMode={isEditMode}
          handleNewBuilding={handleNewBuilding}
          handleSave={handleSave}
          building={editingBuilding}
        />
      </div>

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
                    {building.ward}
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
                          {building.city}
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
                        onClick={handleBuildingDelete}
                      />
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Thông tin Tòa Nhà</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600">Địa Chỉ</div>
                      <div className="font-medium text-slate-900 flex items-center gap-2 mt-1 whitespace-break-spaces">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        {building.address}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Năm Xây Dựng</div>
                      <div className="font-medium text-slate-900">{building.yearBuilt}</div>
                    </div>
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

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Số Tầng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{building.totalFloors}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tổng Phòng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{building.totalRooms}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Thống Kê Phòng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Home className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">Cho thuê</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{occupiedRooms}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Home className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Trống</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{availableRooms}</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Home className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700">Bảo trì</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">{maintenanceRooms}</div>
                    </div>
                  </div>
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
    </div>
  );
};

export default Buildings;
