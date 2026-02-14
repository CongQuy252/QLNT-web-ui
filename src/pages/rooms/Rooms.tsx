import { Edit, Home, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FaImages, FaUserPlus } from 'react-icons/fa';

import PlusRoom from '@/assets/Icon/PlusRoom';
import ImageListDialog from '@/components/ui/ImageView/ImageListDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RoomStatus } from '@/constants/appConstants';
import { rooms } from '@/pages/rooms/data/roomMockData';
import { getStatusBadge, getStatusLabel } from '@/pages/rooms/roomConstants';
import type { Room } from '@/types/room';
import { formatCurrency } from '@/utils/utils';

export default function Rooms() {
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

  //TODO: Phân trang, Edit, Create, Thêm người thuê mới, Huỷ người thuê cũ đối với room đang cho thuê

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="text-slate-600 mt-2">Tổng cộng {rooms.length} phòng</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
              icon={<PlusRoom className="w-16 h-16" />}
            ></Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm phòng mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Số phòng</label>
                <Input
                  placeholder="VD: 101, 102..."
                  value={newRoom?.number}
                  onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tòa nhà</label>
                  <select
                    value={newRoom?.building}
                    onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {['A', 'B', 'C', 'D', 'E'].map((b) => (
                      <option key={b} value={b}>
                        Tòa {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tầng</label>
                  <select
                    value={newRoom?.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((f) => (
                      <option key={f} value={f}>
                        Tầng {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Diện tích (m²)</label>
                  <Input
                    type="number"
                    min="5"
                    max="100"
                    value={newRoom?.area}
                    onChange={(e) => setNewRoom({ ...newRoom, area: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Giá thuê/tháng</label>
                  <Input
                    type="number"
                    min="100000"
                    step="100000"
                    value={newRoom?.price}
                    onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mô tả</label>
                <textarea
                  placeholder="Mô tả chi tiết về phòng..."
                  value={newRoom?.description}
                  onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="flex-1 text-slate-700 border-slate-300 bg-transparent"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={handleAddRoom}
                >
                  Thêm phòng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Tìm kiếm theo số phòng hoặc tòa nhà..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          {[RoomStatus.all, RoomStatus.available, RoomStatus.maintenance, RoomStatus.occupied].map(
            (status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
                className={
                  filterStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 border-slate-300'
                }
              >
                {getStatusLabel(status)}
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const tenant = room.currentTenant ? 'abc' : undefined;
          return (
            <Card key={room.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">Phòng {room.number}</h3>
                    <p className="text-sm text-slate-600">
                      Tòa {room.building} - Tầng {room.floor}
                    </p>
                  </div>
                  <div
                    className="p-2 bg-slate-100 rounded-lg cursor-pointer"
                    onClick={() => {
                      handleOpenDialogViewImage(room.images);
                    }}
                  >
                    <FaImages className="w-5 h-5 text-slate-600" />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Diện tích:</span>
                    <span className="font-semibold text-slate-900">{room.area} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Giá thuê:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(room.price)}/tháng
                    </span>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                      ${getStatusBadge(room.status)}`}
                  >
                    {getStatusLabel(room.status)}
                  </span>
                </div>

                {tenant && room.status === RoomStatus.occupied && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Người thuê hiện tại</p>
                    <p className="font-semibold text-slate-900">Họ và tên</p>
                    <p className="text-xs text-slate-600 mt-1">09090909090</p>
                  </div>
                )}

                {room.description && (
                  <p className="text-sm text-slate-600 italic">"{room.description}"</p>
                )}

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  {room.status === RoomStatus.available && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-slate-700 border-slate-300 bg-transparent"
                          icon={<FaUserPlus className="w-4 h-4" />}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm người thuê phòng</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-slate-600 text-sm">
                            Tính năng chỉnh sửa sẽ được cập nhật trong phiên bản tiếp theo
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-slate-700 border-slate-300 bg-transparent"
                        icon={<Edit className="w-4 h-4" />}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Chỉnh sửa Phòng {room.number}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-slate-600 text-sm">
                          Tính năng chỉnh sửa sẽ được cập nhật trong phiên bản tiếp theo
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Bạn có chắc muốn xoá phòng {room.number}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-slate-600 text-sm">
                          Tính năng chỉnh sửa sẽ được cập nhật trong phiên bản tiếp theo
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {isOpenViewImageDialog && (
        <ImageListDialog
          open={isOpenViewImageDialog}
          onClose={handleCloseDialogViewImage}
          images={list}
          title="Danh sách hình ảnh phòng"
        />
      )}

      {filteredRooms.length === 0 && (
        <Card className="p-12 bg-white text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy phòng nào phù hợp</p>
        </Card>
      )}
    </div>
  );
}
