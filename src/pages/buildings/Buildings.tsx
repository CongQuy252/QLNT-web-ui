import { Building2, Home, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Building } from '@/types/building';
import type { Room } from '@/types/room';

const Buildings = () => {
  const buildings: Building[] = [
    {
      id: 'building1',
      name: 'Tòa nhà A',
      address: '123 Đường Nguyễn Huệ',
      district: 'Quận 1',
      city: 'Thành phố Hồ Chí Minh',
      totalFloors: 5,
      totalRooms: 20,
      yearBuilt: 2015,
      owner: 'owner1',
      phone: '0901234567',
      email: 'tonhaA@example.com',
      description: 'Tòa nhà cho thuê phòng trọ hiện đại với đầy đủ tiện ích',
      utilities: ['Điều hòa', 'Nước nóng', 'WiFi miễn phí', 'Giặt tự động'],
    },
    {
      id: 'building2',
      name: 'Tòa nhà B',
      address: '456 Đường Trần Hưng Đạo',
      district: 'Quận 5',
      city: 'Thành phố Hồ Chí Minh',
      totalFloors: 3,
      totalRooms: 12,
      yearBuilt: 2018,
      owner: 'owner1',
      phone: '0901234567',
      email: 'tonhaB@example.com',
      description: 'Tòa nhà gần trường đại học, phù hợp sinh viên',
      utilities: ['Điều hòa', 'WiFi miễn phí', 'Bảo vệ 24/7'],
    },
    {
      id: 'building3',
      name: 'Tòa nhà C',
      address: '789 Đường Pasteur',
      district: 'Quận 3',
      city: 'Thành phố Hồ Chí Minh',
      totalFloors: 4,
      totalRooms: 16,
      yearBuilt: 2020,
      owner: 'owner1',
      phone: '0901234567',
      email: 'tonhaC@example.com',
      description: 'Tòa nhà mới xây, có thang máy và khu vui chơi chung',
      utilities: ['Điều hòa', 'Nước nóng', 'WiFi miễn phí', 'Gym'],
    },
    {
      id: 'building4',
      name: 'Tòa nhà D',
      address: '789 Đường Pasteur',
      district: 'Quận 3',
      city: 'Thành phố Hồ Chí Minh',
      totalFloors: 4,
      totalRooms: 16,
      yearBuilt: 2020,
      owner: 'owner1',
      phone: '0901234567',
      email: 'tonhaD@example.com',
      description: 'Tòa nhà mới xây, có thang máy và khu vui chơi chung',
      utilities: ['Điều hòa', 'Nước nóng', 'WiFi miễn phí', 'Gym'],
    },
    {
      id: 'building5',
      name: 'Tòa nhà E',
      address: '101 Đường Lê Lợi',
      district: 'Quận 2',
      city: 'Thành phố Hồ Chí Minh',
      totalFloors: 4,
      totalRooms: 16,
      yearBuilt: 2020,
      owner: 'owner1',
      phone: '0901234567',
      email: 'tonhaE@example.com',
      description: 'Tòa nhà mới xây, có thang máy và khu vui chơi chung',
      utilities: ['Điều hòa', 'Nước nóng', 'WiFi miễn phí', 'Gym'],
    },
    {
      id: 'building6',
      name: 'Tòa nhà F',
      address: '101 Đường Lê Lợi',
      district: 'Quận 2',
      city: 'Thành phố Hồ Chí Minh',
      totalFloors: 4,
      totalRooms: 16,
      yearBuilt: 2020,
      owner: 'owner1',
      phone: '0901234567',
      email: 'tonhaF@example.com',
      description: 'Tòa nhà mới xây, có thang máy và khu vui chơi chung',
      utilities: ['Điều hòa', 'Nước nóng', 'WiFi miễn phí', 'Gym'],
    },
    {
      id: 'building7',
      name: 'Tòa nhà G',
      address: '101 Đường Lê Lợi',
      district: 'Quận 2',
      city: 'Thành phố Hồ Chí Minh',
      totalFloors: 4,
      totalRooms: 16,
      yearBuilt: 2020,
      owner: 'owner1',
      phone: '0901234567',
      email: 'tonhaG@example.com',
      description: 'Tòa nhà mới xây, có thang máy và khu vui chơi chung',
      utilities: ['Điều hòa', 'Nước nóng', 'WiFi miễn phí', 'Gym'],
    },
  ];

  const mockRooms: Room[] = [
    {
      id: 'room1',
      number: '101',
      building: 'A',
      floor: 1,
      area: 25,
      price: 3000000,
      status: 'occupied',
      currentTenant: 'tenant1',
      description: 'Phòng đơn, có cửa sổ',
    },
    {
      id: 'room2',
      number: '102',
      building: 'A',
      floor: 1,
      area: 30,
      price: 3500000,
      status: 'occupied',
      currentTenant: 'tenant2',
      description: 'Phòng đôi, có toilet riêng',
    },
    {
      id: 'room3',
      number: '103',
      building: 'A',
      floor: 1,
      area: 25,
      price: 3000000,
      status: 'available',
      description: 'Phòng đơn',
    },
    {
      id: 'room4',
      number: '201',
      building: 'A',
      floor: 2,
      area: 35,
      price: 4000000,
      status: 'available',
      description: 'Phòng lớn, ban công',
    },
    {
      id: 'room5',
      number: '301',
      building: 'B',
      floor: 3,
      area: 28,
      price: 3200000,
      status: 'maintenance',
      description: 'Đang sửa chữa',
    },
  ];
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    district: '',
    city: '',
    totalFloors: '',
    totalRooms: '',
    yearBuilt: '',
    phone: '',
    email: '',
    description: '',
  });

  const handleNewBuilding = () => {
    setIsEditMode(false);
    setFormData({
      name: '',
      address: '',
      district: '',
      city: '',
      totalFloors: '',
      totalRooms: '',
      yearBuilt: '',
      phone: '',
      email: '',
      description: '',
    });
    setIsOpen(true);
  };

  const handleEditBuilding = (building: Building) => {
    setIsEditMode(true);
    setFormData({
      name: building.name,
      address: building.address,
      district: building.district,
      city: building.city,
      totalFloors: building.totalFloors.toString(),
      totalRooms: building.totalRooms.toString(),
      yearBuilt: building.yearBuilt.toString(),
      phone: building.phone,
      email: building.email,
      description: building.description || '',
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    setIsOpen(false);
    // In a real app, this would save to database
  };

  const building = selectedBuilding ? buildings.find((b) => b.id === selectedBuilding) : null;

  const getRoomsByBuilding = (buildingId: string): Room[] => {
    const buildingName = buildings.find((b) => b.id === buildingId)?.name;
    return mockRooms.filter((r) => r.building === buildingName?.charAt(buildingName.length - 1));
  };

  const buildingRooms = building ? getRoomsByBuilding(building.id) : [];
  const occupiedRooms = buildingRooms.filter((r) => r.status === 'occupied').length;
  const availableRooms = buildingRooms.filter((r) => r.status === 'available').length;
  const maintenanceRooms = buildingRooms.filter((r) => r.status === 'maintenance').length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Quản lý Tòa Nhà</h1>
          <p className="text-slate-600">Quản lý thông tin và thống kê tòa nhà</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleNewBuilding}
              className="gap-2"
              icon={<Plus className="h-4 w-4" />}
            >
              Thêm Tòa Nhà
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Chỉnh sửa Tòa Nhà' : 'Thêm Tòa Nhà Mới'}</DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? 'Cập nhật thông tin tòa nhà'
                  : 'Nhập thông tin chi tiết của tòa nhà mới'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Tên Tòa Nhà
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Tòa nhà A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Địa Chỉ
                </Label>
                <Input
                  id="address"
                  placeholder="Địa chỉ tòa nhà"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="district" className="text-sm font-medium text-slate-700">
                    Quận/Huyện
                  </Label>
                  <Input
                    id="district"
                    placeholder="VD: Quận 1"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                    Thành Phố
                  </Label>
                  <Input
                    id="city"
                    placeholder="VD: TP HCM"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="floors" className="text-sm font-medium text-slate-700">
                    Số Tầng
                  </Label>
                  <Input
                    id="floors"
                    type="number"
                    placeholder="5"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="rooms" className="text-sm font-medium text-slate-700">
                    Số Phòng
                  </Label>
                  <Input
                    id="rooms"
                    type="number"
                    placeholder="20"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-sm font-medium text-slate-700">
                    Năm Xây
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2020"
                    value={formData.yearBuilt}
                    onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                    Số Điện Thoại
                  </Label>
                  <Input
                    id="phone"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Mô Tả
                </Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về tòa nhà..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {isEditMode ? 'Cập nhật' : 'Thêm Tòa Nhà'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedBuilding === building.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-slate-50 border-2 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-medium text-slate-900">{building.name}</div>
                  <div className="text-sm text-slate-600">{building.district}</div>
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
                      <div className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {building.address}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Năm Xây Dựng</div>
                      <div className="font-medium text-slate-900">{building.yearBuilt}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Số Điện Thoại</div>
                      <div className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {building.phone}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Email</div>
                      <div className="font-medium text-slate-900 flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-slate-400" />
                        {building.email}
                      </div>
                    </div>
                  </div>
                  {building.description && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-slate-600 mb-2">Mô Tả</div>
                      <div className="text-slate-900">{building.description}</div>
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
