import { Calendar, Edit, Mail, Phone, Users } from 'lucide-react';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { PiHouseLine } from 'react-icons/pi';

import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import CreateOrUpdateTenant from '@/pages/dialogs/createOrupdateTenant/CreateOrUpdateTenant';
import { rooms } from '@/pages/rooms/data/roomMockData';
import type { Room } from '@/types/room';
import type { User } from '@/types/user';

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
    {
      id: 'tenant2',
      name: 'Nguyễn Văn A',
      idNumber: '0123456789',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      contractEndDate: '2025-12-31',
      status: 'active',
    },
    {
      id: 'tenant3',
      name: 'Nguyễn Văn A',
      idNumber: '0123456789',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      contractEndDate: '2025-12-31',
      status: 'active',
    },
    {
      id: 'tenant4',
      name: 'Nguyễn Văn A',
      idNumber: '0123456789',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      contractEndDate: '2025-12-31',
      status: 'active',
    },
    {
      id: 'tenant5',
      name: 'Nguyễn Văn A',
      idNumber: '0123456789',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      contractEndDate: '2025-12-31',
      status: 'active',
    },
    {
      id: 'tenant6',
      name: 'Nguyễn Văn A',
      idNumber: '0123456789',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      contractEndDate: '2025-12-31',
      status: 'active',
    },
    {
      id: 'tenant7',
      name: 'Nguyễn Văn A',
      idNumber: '0123456789',
      email: 'nguyenvana@example.com',
      phone: '0987654321',
      contractEndDate: '2025-12-31',
      status: 'active',
    },
    {
      id: 'tenant8',
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<User | undefined>();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // đóng
          : [...prev, id], // mở thêm
    );
  };

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

  //TODO: Phân trang, Edit, Create

  return (
    <div className="space-y-8 flex flex-col h-full overflow-hidden">
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
              onClick={() => {
                setEditingTenant(undefined);
                setIsAddOpen(true);
              }}
            />
          </DialogTrigger>

          <CreateOrUpdateTenant
            isOpen={isAddOpen}
            tenant={editingTenant}
            onClose={() => setIsAddOpen(false)}
          />
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Tìm kiếm theo số điện thoại"
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
      <div className="flex-1 overflow-y-auto pr-2">
        {/* <table className="w-full text-sm">
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
                const room: Room = rooms[1];
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
                            // onClick={() => {
                            //   setEditingTenant({
                            //     id: tenant.id,
                            //     fullName: tenant.name,
                            //     email: tenant.email,
                            //     phone: tenant.phone,
                            //     username: tenant.email.split('@')[0],
                            //     role: 'tenant',
                            //     CCCD: tenant.idNumber,
                            //     CCCDImage: [],
                            //   });
                            //   setIsAddOpen(true);
                            // }}
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
          </table> */}

        <div className="grid gap-4">
          {filteredTenants.map((tenant) => {
            const room: Room = rooms[1];
            const daysLeft = daysUntilExpiry(tenant.contractEndDate);
            const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
            const isOpen = expandedIds.includes(tenant.id);

            return (
              <Card key={tenant.id} className="p-4 cursor-pointer hover:shadow-md transition">
                {/* Header */}
                <div
                  className="flex justify-between items-center"
                  onClick={() => toggleExpand(tenant.id)}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{tenant.name}</p>
                    <p className="text-xs text-slate-500">{tenant.phone}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      tenant.status,
                    )}`}
                  >
                    {getStatusLabel(tenant.status)}
                  </span>
                </div>

                {/* Expand content */}
                {isOpen && (
                  <div className="mt-4 border-t pt-4 space-y-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {tenant.email}
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {tenant.phone}
                    </div>

                    <div className="flex items-center gap-2">
                      <PiHouseLine className="w-4 h-4" />
                      {room ? `Phòng ${room.number}` : 'N/A'}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <p>{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hết hạn'}</p>
                        <p className="text-xs text-slate-500">Đến {tenant.contractEndDate}</p>
                      </div>
                    </div>

                    {isExpiringSoon && <p className="text-orange-600 text-xs">⚠ Sắp hết hạn</p>}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-slate-700 border-slate-300 bg-transparent"
                          // onClick={() => {
                          //   setEditingTenant({
                          //     id: tenant.id,
                          //     fullName: tenant.name,
                          //     email: tenant.email,
                          //     phone: tenant.phone,
                          //     username: tenant.email.split('@')[0],
                          //     role: 'tenant',
                          //     CCCD: tenant.idNumber,
                          //     CCCDImage: [],
                          //   });
                          //   setIsAddOpen(true);
                          // }}
                          icon={<Edit className="w-4 h-4" />}
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <AlertDialogHeader>
                          <DialogTitle>{tenant.name}</DialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-slate-600 text-sm">
                            Tính năng chỉnh sửa sẽ được cập nhật trong phiên bản tiếp theo
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

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
