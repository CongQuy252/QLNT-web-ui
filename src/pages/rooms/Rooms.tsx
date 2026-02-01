import { Edit, Home, Trash2 } from 'lucide-react';
import { useState } from 'react';

import PlusRoom from '@/assets/Icon/PlusRoom';
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

export default function Rooms() {
  const rooms = [
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'available' | 'occupied' | 'maintenance'
  >('all');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Trống';
      case 'occupied':
        return 'Đã cho thuê';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="text-slate-600 mt-2">Tổng cộng {rooms.length} phòng</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
              icon={<PlusRoom className="w-16 h-16" />}
            ></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm phòng mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-slate-600 text-sm">
                Tính năng thêm phòng mới sẽ được cập nhật trong phiên bản tiếp theo
              </p>
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
          {(['all', 'available', 'occupied', 'maintenance'] as const).map((status) => (
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
              {status === 'all' && 'Tất cả'}
              {status === 'available' && 'Trống'}
              {status === 'occupied' && 'Đã cho thuê'}
              {status === 'maintenance' && 'Bảo trì'}
            </Button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          // const tenant = room.currentTenant ? getTenantByRoomId(room.id) : null;
          const tenant = room.currentTenant ? 'abc' : null;
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
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Home className="w-5 h-5 text-slate-600" />
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
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      room.status,
                    )}`}
                  >
                    {getStatusLabel(room.status)}
                  </span>
                </div>

                {tenant && (
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                    icon={<Trash2 className="w-4 h-4" />}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="p-12 bg-white text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy phòng nào phù hợp</p>
        </Card>
      )}
    </div>
  );
}
