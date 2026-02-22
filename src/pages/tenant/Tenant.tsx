import { Edit, Mail, Phone, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { PiHouseLine } from 'react-icons/pi';

import { useGetTenantQueries } from '@/api/tenant';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TenantStatus } from '@/constants/appConstants';
import CreateOrUpdateTenant from '@/pages/dialogs/createOrupdateTenant/CreateOrUpdateTenant';
import { rooms } from '@/pages/rooms/data/roomMockData';
import UpdateTenantDialog from '@/pages/tenant/dialogs/UpdateTenantDialog';
import type { Room } from '@/types/room';
import type { UpdateTenantRequest } from '@/types/user';

const Tenant = () => {
  const getTenantQueries = useGetTenantQueries();
  const pageSize = 20;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TenantStatus>(TenantStatus.all);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<UpdateTenantRequest | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // đóng
          : [...prev, id], // mở thêm
    );
  };

  const tenants = useMemo(() => {
    return (
      getTenantQueries.data?.data?.map((b) => ({
        ...b,
        id: b._id,
      })) ?? []
    );
  }, [getTenantQueries.data]);

  const pagination = getTenantQueries.data?.pagination;

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === TenantStatus.all || tenant.status === filterStatus;
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

  const handleSaveEditTenant = () => {
    if (!editingTenant) return;
    console.log('Edited');
    setIsEditOpen(false);
  };

  //TODO: Phân trang, Edit, Create

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
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
      <div className="flex flex-col md:flex-row gap-4 mt-3">
        <div className="relative flex-1">
          <Input
            placeholder="Tìm kiếm ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="peer"
          />
          <div
            className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2
                  opacity-0 peer-focus:opacity-100
                  transition-all duration-200
                  bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap"
          >
            Nhập tên người thuê
            <div
              className="absolute left-1/2 top-full -translate-x-1/2
                    border-6 border-transparent border-t-gray-900"
            ></div>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          {[TenantStatus.all, TenantStatus.active, TenantStatus.inactive].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 border-slate-300'
              }`}
            >
              {status === TenantStatus.all && 'Tất cả'}
              {status === TenantStatus.active && 'Đang ở'}
              {status === TenantStatus.inactive && 'Đã trả'}
            </Button>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-4">
          {filteredTenants.map((tenant) => {
            const room: Room = rooms[1];
            // const daysLeft = daysUntilExpiry(tenant.contractEndDate);
            // const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
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

                    {/* <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <p>{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Hết hạn'}</p>
                        <p className="text-xs text-slate-500">Đến {tenant.contractEndDate}</p>
                      </div>
                    </div> */}

                    {/* {isExpiringSoon && <p className="text-orange-600 text-xs">⚠ Sắp hết hạn</p>} */}

                    {/* <Dialog>
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
                    </Dialog> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTenant(tenant);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-slate-600">
            {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, pagination.total)} / {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev || getTenantQueries.isLoading}
            >
              Trước
            </Button>
            <span className="text-sm text-slate-600">
              {currentPage} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext || getTenantQueries.isLoading}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}

      {editingTenant && (
        <UpdateTenantDialog
          isOpen={isEditOpen}
          tenant={editingTenant}
          rooms={rooms}
          onClose={() => setIsEditOpen(false)}
          onChange={setEditingTenant}
          onSave={handleSaveEditTenant}
        />
      )}
    </div>
  );
};

export default Tenant;
