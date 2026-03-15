import { queryClient } from '@/lib/reactQuery';
import { Edit, Mail, Phone, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { LiaIdCard } from 'react-icons/lia';

import { useGetTenantQueries } from '@/api/tenant';
import { useUpdateUserMutation } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ImageListDialog from '@/components/ui/imageView/ImageListDialog';
import { Input } from '@/components/ui/input';
import { QueriesKey, TenantStatus, UserRole } from '@/constants/appConstants';
import { useToast } from '@/hooks/useToast';
import CreateOrUpdateTenant from '@/pages/dialogs/createOrupdateTenant/CreateOrUpdateTenant';
import UpdateTenantDialog from '@/pages/tenant/dialogs/UpdateTenantDialog';
import type { UpdateTenantRequest } from '@/types/user';

const Tenant = () => {
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TenantStatus>(TenantStatus.all);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<UpdateTenantRequest>();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState<string>('');
  const { success, error } = useToast();
  const [imageList, setImageList] = useState<string[]>([]);
  const updateUserMutation = useUpdateUserMutation();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const getTenantQueries = useGetTenantQueries(
    {
      status: filterStatus !== TenantStatus.all ? filterStatus : undefined,
      page: currentPage,
      limit: pageSize,
    },
    true,
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const tenants = useMemo(() => {
    return (
      getTenantQueries.data?.data?.map((b) => ({
        ...b,
        id: b._id,
        // Flatten user data for backward compatibility
        name: b.name || b.userId?.name || '',
        email: b.email || b.userId?.email || '',
        phone: b.phone || b.userId?.phone || '',
        cccd: b.cccd || b.userId?.cccd || '',
        cccdImages: b.cccdImages || b.userId?.cccdImages,
        role: b.role,
      })) ?? []
    );
  }, [getTenantQueries.data]);

  const pagination = getTenantQueries.data?.pagination;

  const filteredTenants = useMemo(() => {
    // First filter by search term
    const filtered = tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        tenant.phone.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesSearch;
    });

    // Remove duplicates: keep only the most recent tenant for each user
    // Group by userId or by combination of phone + cccd (as fallback)
    const uniqueTenants = new Map<string, (typeof filtered)[0]>();

    filtered.forEach((tenant) => {
      const key = tenant.userId?._id || `${tenant.phone}-${tenant.cccd || ''}`;

      const existing = uniqueTenants.get(key);
      if (!existing) {
        uniqueTenants.set(key, tenant);
      } else {
        // Compare createdAt dates - keep the newer one
        const existingDate = new Date(existing.createdAt || 0);
        const currentDate = new Date(tenant.createdAt || 0);

        if (currentDate > existingDate) {
          uniqueTenants.set(key, tenant);
        }
      }
    });

    return Array.from(uniqueTenants.values());
  }, [tenants, debouncedSearchTerm]);

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Đang ở' : 'Đã trả phòng';
  };

  const handleSaveEditTenant = (data: UpdateTenantRequest) => {
    if (!editingTenantId) {
      error('Không tìm thấy ID người thuê');
      return;
    }

    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.cccd) formData.append('cccd', data.cccd);

    if (data.cccdImagesFront && data.cccdImagesFront instanceof File) {
      formData.append('cccdFront', data.cccdImagesFront);
    }

    if (data.cccdImagesBack && data.cccdImagesBack instanceof File) {
      formData.append('cccdBack', data.cccdImagesBack);
    }

    updateUserMutation.mutate(
      {
        userId: editingTenantId,
        data: formData,
      },
      {
        onSuccess: () => {
          success('Cập nhật người thuê thành công');
          setIsEditOpen(false);
          setEditingTenant(undefined);
          setEditingTenantId('');
          // Refresh tenant list
          getTenantQueries.refetch();
          queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
          queryClient.invalidateQueries({ queryKey: [QueriesKey.user] });
          queryClient.invalidateQueries({ queryKey: [QueriesKey.users] });
        },
        onError: () => {
          error('Có lỗi xảy ra khi cập nhật người thuê');
        },
      },
    );
  };

  const handleOpenImageViewer = (cccd: { front: string; back: string }) => {
    setImageList([cccd.front, cccd.back]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý người thuê</h1>
          <p className="text-slate-600 mt-2">Tổng cộng {pagination?.total || 0} người thuê</p>
        </div>
        <Button
          className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
          icon={<FaUserPlus className="w-4 h-4" />}
          onClick={() => {
            setEditingTenant(undefined);
            setIsAddOpen(true);
          }}
        />

        <CreateOrUpdateTenant
          isOpen={isAddOpen}
          tenant={editingTenant}
          onClose={() => setIsAddOpen(false)}
        />
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

                  {tenant.role !== UserRole.admin && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        tenant.status,
                      )}`}
                    >
                      {getStatusLabel(tenant.status)}
                    </span>
                  )}
                </div>

                {/* Expand content */}
                {isOpen && (
                  <div className="border-t pt-4 space-y-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {tenant.email}
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {tenant.phone}
                    </div>

                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        tenant.cccdImages &&
                        handleOpenImageViewer({
                          front: tenant.cccdImages.front.url,
                          back: tenant.cccdImages.back.url,
                        })
                      }
                    >
                      <LiaIdCard className="w-4 h-4" />
                      {tenant.cccd?.trim() || 'Không có thông tin CCCD'}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTenantId(tenant.userId._id);
                        setEditingTenant({
                          name: tenant.name || '',
                          phone: tenant.phone || '',
                          email: tenant.email || '',
                          role: tenant.role || UserRole.tenant,
                          cccd: tenant.cccd ?? '',
                          cccdImagesFront: tenant.cccdImages?.front?.url || '',
                          cccdImagesBack: tenant.cccdImages?.back?.url || '',
                        });
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
          onSubmit={handleSaveEditTenant}
          onClose={() => {
            setIsEditOpen(false);
            setEditingTenant(undefined);
            setEditingTenantId('');
          }}
        />
      )}

      {imageList?.length > 0 && (
        <ImageListDialog
          images={imageList}
          open={imageList?.length > 0}
          onClose={() => setImageList([])}
          title="Hình ảnh CCCD"
        />
      )}
    </div>
  );
};

export default Tenant;
