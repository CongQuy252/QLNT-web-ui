import { Calendar, Edit, Mail, Phone, Users } from 'lucide-react';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';

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
import type { Room } from '@/types/room';

const Tenant = () => {
  const tenants = [
    {
      id: 'tenant1',
      name: 'Nguyễn Văn A',
      idNumber: '0123456789',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      contractEndDate: '2025-12-31',
      status: 'active',
    },
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Đang ở' : 'Đã trả phòng';
  };

  const daysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý người thuê</h1>
          <p className="text-slate-600 mt-2">Tổng cộng {tenants.length} người thuê</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
              icon={<FaUserPlus className="w-4 h-4" />}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm người thuê mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-slate-600 text-sm">
                Tính năng thêm người thuê mới sẽ được cập nhật trong phiên bản tiếp theo
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((status) => (
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
              {status === 'active' && 'Đang ở'}
              {status === 'inactive' && 'Đã trả'}
            </Button>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <Card className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Họ tên</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Phòng</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Số điện thoại</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Hợp đồng</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Trạng thái</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => {
                const room: Room = {
                  id: 'room1',
                  number: '101',
                  building: 'A',
                  status: RoomStatus.occupied,
                  floor: 1,
                  area: 20,
                  price: 5000000,
                  currentTenant: tenant.id,
                  description: 'Phòng đẹp, có ban công',
                };
                const daysLeft = daysUntilExpiry(tenant.contractEndDate);
                const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;

                return (
                  <tr key={tenant.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-slate-900">{tenant.name}</p>
                        <p className="text-xs text-slate-600">{tenant.idNumber}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-900">
                        {room ? `Phòng ${room.number}` : 'N/A'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        {tenant.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        {tenant.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-600" />
                        <div className="text-sm">
                          <p className="text-slate-900 font-medium">
                            {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hết hạn'}
                          </p>
                          <p className="text-xs text-slate-600">Đến {tenant.contractEndDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          tenant.status,
                        )}`}
                      >
                        {getStatusLabel(tenant.status)}
                      </span>
                      {isExpiringSoon && (
                        <span className="block text-xs text-orange-600 mt-1">⚠ Sắp hết hạn</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-slate-700 border-slate-300 bg-transparent"
                            icon={<Edit className="w-4 h-4" />}
                          />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa thông tin {tenant.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <p className="text-slate-600 text-sm">
                              Tính năng chỉnh sửa sẽ được cập nhật trong phiên bản tiếp theo
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredTenants.length === 0 && (
        <Card className="p-12 bg-white text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy người thuê nào phù hợp</p>
        </Card>
      )}
    </div>
  );
};

export default Tenant;
