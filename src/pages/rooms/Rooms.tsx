import { queryClient } from '@/lib/reactQuery';
import { Edit, Home, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';

import { useUpdateUserMutation } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirmDialog/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToastContainer } from '@/components/ui/toast/Toast';
import { QueriesKey } from '@/constants/appConstants';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/useToast';
import EditTenantDialog from '@/pages/rooms/components/EditTenantDialog';
import { UserCard } from '@/pages/rooms/components/UserCard';
import { getStatusBadge, getStatusLabel } from '@/pages/rooms/roomConstants';
import { useRooms } from '@/pages/rooms/useRooms';
import { ROOMSTATUS } from '@/types/room';
import type { Room } from '@/types/room';
import type { UpdateTenantRequest } from '@/types/user';
import { formatCurrency, formatNumber, parseNumber } from '@/utils/utils';

const Rooms = () => {
  const isMobile = useMobile();
  const { success, error: errorToast, toasts } = useToast();
  const updateTenantMutation = useUpdateUserMutation();
  const {
    totalItems,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editRoom,
    setEditRoom,
    handleUpdateRoom,
    updateRoomMutation,
    deleteRoomMutation,
    removeTenantMutation,
    handleAssignTenant,
    handleConfirmAssign,
    handleRemoveTenant,
    assignConfirmOpen,
    setAssignConfirmOpen,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    error,
    filteredRooms,
    handleEditRoom,
    pagination,
    currentPage,
    pageSize,
    setCurrentPage,
    filteredUsers,
    phoneSearch,
    setPhoneSearch,
    selectedUser,
    setSelectedUser,
    openAddTenant,
    setopenAddTenant,
    setConfirmOpen,
    handleConfirmDelete,
    handleAskDeleteRoom,
    confirmMessage,
    confirmOpen,
    roomSelected,
    handleOpenAddTenant,
    assignTenantMutation,
  } = useRooms();

  const [isOpenEditTenant, setIsOpenEditTenant] = useState(false);
  const [tenantEditing, setTenantEditing] = useState<string>('');
  const [isOpenViewTenant, setIsOpenViewTenant] = useState(false);
  const [tenantUserId, setTenantUserId] = useState<string>('');
  /*
  Thực hiện update tenant với tenant id
*/

  const handleClickEditTenantButton = (userId?: string) => {
    if (!userId) {
      return;
    }

    setTenantEditing(userId);
    setIsOpenEditTenant(true);
  };

  const handleSaveEditTenant = (data: UpdateTenantRequest) => {
    if (!tenantEditing) {
      errorToast('Không tìm thấy ID người thuê');
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

    updateTenantMutation.mutate(
      {
        userId: tenantEditing,
        data: formData,
      },
      {
        onSuccess: () => {
          success('Cập nhật người thuê thành công');
          setIsOpenEditTenant(false);
          setTenantEditing('');
          queryClient.invalidateQueries({ queryKey: [QueriesKey.users] });
          queryClient.invalidateQueries({ queryKey: [QueriesKey.rooms] });
          queryClient.invalidateQueries({ queryKey: [QueriesKey.user] });
        },
        onError: () => {
          errorToast('Có lỗi xảy ra khi cập nhật người thuê');
        },
      },
    );
  };

  const handleClickViewTenant = (userId: string) => {
    setIsOpenViewTenant(true);
    setTenantUserId(userId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="text-slate-600 mt-2">{`Tổng cộng ${totalItems} phòng`}</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-screen h-screen max-w-none rounded-none sm:h-auto sm:max-w-lg sm:rounded-lg flex flex-col max-h-screen">
            <DialogHeader className="shrink-0">
              <DialogTitle>Chỉnh sửa phòng {editRoom?.number}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Tên phòng</Label>
                <Input
                  placeholder="VD: 101, 102..."
                  value={editRoom?.number || ''}
                  onChange={(e) => editRoom && setEditRoom({ ...editRoom, number: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Trạng thái</Label>

                <Select
                  value={editRoom?.status ?? ROOMSTATUS.AVAILABLE}
                  onValueChange={(value) =>
                    editRoom && setEditRoom({ ...editRoom, status: value as ROOMSTATUS })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái phòng" />
                  </SelectTrigger>

                  <SelectContent>
                    {!editRoom?.currentTenant && (
                      <SelectItem value={ROOMSTATUS.AVAILABLE}>
                        {getStatusLabel(ROOMSTATUS.AVAILABLE)}
                      </SelectItem>
                    )}

                    <SelectItem value={ROOMSTATUS.MAINTENANCE}>
                      {getStatusLabel(ROOMSTATUS.MAINTENANCE)}
                    </SelectItem>

                    <SelectItem value={ROOMSTATUS.OCCUPIED}>
                      {getStatusLabel(ROOMSTATUS.OCCUPIED)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Diện tích (m²)</Label>
                  <Input
                    type="number"
                    min="5"
                    max="100"
                    value={editRoom?.area || 0}
                    onChange={(e) =>
                      editRoom && setEditRoom({ ...editRoom, area: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Giá phòng</Label>
                  <Input
                    type="text"
                    value={formatNumber(editRoom?.price || 0)}
                    onChange={(e) =>
                      editRoom &&
                      setEditRoom({ ...editRoom, price: parseNumber(e.target.value) ?? 0 })
                    }
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-800 border-b pb-2">
                  Cấu hình giá dịch vụ
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Giá điện (VNĐ/kWh)</Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom?.electricityUnitPrice || 0)}
                      onChange={(e) =>
                        editRoom &&
                        setEditRoom({
                          ...editRoom,
                          electricityUnitPrice: parseNumber(e.target.value) ?? 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Giá nước (VNĐ/m³)</Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom?.waterUnitPrice || 0)}
                      onChange={(e) =>
                        editRoom &&
                        setEditRoom({
                          ...editRoom,
                          waterUnitPrice: parseNumber(e.target.value) ?? 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Internet (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom?.internetFee || 0)}
                      onChange={(e) =>
                        editRoom &&
                        setEditRoom({ ...editRoom, internetFee: parseNumber(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Gửi xe &nbsp; (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom?.parkingFee || 0)}
                      onChange={(e) =>
                        editRoom &&
                        setEditRoom({ ...editRoom, parkingFee: parseNumber(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Dịch vụ (VNĐ/tháng)
                    </Label>
                    <Input
                      type="text"
                      value={formatNumber(editRoom?.serviceFee || 0)}
                      onChange={(e) =>
                        editRoom &&
                        setEditRoom({ ...editRoom, serviceFee: parseNumber(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Mô tả</Label>
                <Textarea
                  placeholder="Mô tả chi tiết về phòng..."
                  value={editRoom?.description || ''}
                  onChange={(e) =>
                    editRoom && setEditRoom({ ...editRoom, description: e.target.value })
                  }
                  className={`w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none mt-1 break-all overflow-auto ${isMobile ? 'h-45' : 'h-10'} resize-none scrollbar`}
                  rows={4}
                  maxLength={500}
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200 shrink-0">
                <Button
                  variant="outline"
                  className="flex-1 text-slate-700 border-slate-300 bg-transparent"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={handleUpdateRoom}
                  disabled={updateRoomMutation.isPending}
                >
                  {updateRoomMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-3">
        <div className="relative flex-1">
          <Input
            placeholder="Tìm kiếm ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi search
            }}
            className="peer"
          />
          <div
            className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2
                  opacity-0 peer-focus:opacity-100
                  transition-all duration-200
                  bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap"
          >
            Nhập số phòng hoặc tên tòa nhà để tìm kiếm
            <div
              className="absolute left-1/2 top-full -translate-x-1/2
                    border-6 border-transparent border-t-gray-900"
            ></div>
          </div>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto">
          {['0', ROOMSTATUS.AVAILABLE, ROOMSTATUS.MAINTENANCE, ROOMSTATUS.OCCUPIED].map(
            (status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={`${
                  filterStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 border-slate-300'
                } p-[11.5px]`}
              >
                {getStatusLabel(status)}
              </Button>
            ),
          )}
        </div>
      </div>

      {!isLoading && !error && filteredRooms.length === 0 ? (
        <Card className="p-12 bg-white text-center h-screen grid place-content-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy phòng nào phù hợp</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
          {isLoading && (
            <div className="col-span-full flex justify-center py-8">
              <div className="text-slate-600">Đang tải danh sách phòng...</div>
            </div>
          )}

          {error && (
            <div className="col-span-full flex justify-center py-8">
              <div className="text-red-600">Có lỗi xảy ra khi tải danh sách phòng</div>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredRooms.map((room: Room) => {
              const tenant = room.currentTenant ? room.currentTenant : undefined;

              return (
                <Card key={room._id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900">{room.number}</h3>
                        <p className="text-sm text-slate-600">
                          Tòa {room.buildingName || room.buildingId} - Tầng {room.floor}
                        </p>
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

                    <div className={`p-3 ${tenant ? 'bg-slate-50' : 'flex-1'} rounded-lg`}>
                      {tenant && room.status === ROOMSTATUS.OCCUPIED && (
                        <div
                          onClick={() => handleClickViewTenant(tenant._id)}
                          className="cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs text-slate-600">Người thuê hiện tại</p>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-600 hover:text-gray-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClickEditTenantButton(room.currentTenant?._id);
                                }}
                                icon={<Edit className="w-3 h-3" />}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTenant(room);
                                }}
                                disabled={removeTenantMutation.isPending}
                                icon={<Trash2 className="w-3 h-3" />}
                              />
                            </div>
                          </div>
                          <p className="font-semibold text-slate-900">{tenant.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{tenant.email}</p>{' '}
                        </div>
                      )}
                    </div>

                    {room.description && (
                      <p className="text-sm text-slate-600 italic">"{room.description}"</p>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      {room.status === ROOMSTATUS.AVAILABLE && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-slate-700 border-slate-300 bg-transparent"
                          icon={<FaUserPlus className="w-4 h-4" />}
                          onClick={() => handleOpenAddTenant(room)}
                        />
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-slate-700 border-slate-300 bg-transparent"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() => handleEditRoom(room)}
                      />

                      {room.status !== ROOMSTATUS.OCCUPIED && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => {
                            handleAskDeleteRoom(room);
                          }}
                          disabled={false}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* Dialog add tenant - global */}
      <Dialog open={openAddTenant} onOpenChange={setopenAddTenant}>
        <DialogContent
          className="w-screen h-screen max-w-none rounded-none sm:h-auto sm:max-w-lg sm:rounded-lg top-0 translate-y-0 flex flex-col"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Thêm người thuê phòng {roomSelected?.number}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4 flex-1 min-h-0">
            <Input
              placeholder="Tìm theo số điện thoại..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              autoFocus
            />

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {filteredUsers?.length === 0 && (
                <p className="p-3 text-sm text-slate-500">Không tìm thấy</p>
              )}

              {filteredUsers?.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                  }}
                  className={`p-3 cursor-pointer flex justify-between items-center hover:bg-slate-100 ${selectedUser?._id === user._id ? 'bg-slate-100' : ''}`}
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.phone}</p>
                  </div>

                  {selectedUser?._id === user._id && (
                    <span className="text-sm text-green-600">✓</span>
                  )}
                </div>
              ))}
            </div>

            {selectedUser && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-600">
                    Đã chọn: <span className="font-medium">{selectedUser.name}</span>
                  </span>
                  <Button
                    size="sm"
                    onClick={handleAssignTenant}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Xác nhận gán
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận assign tenant */}
      <Dialog open={assignConfirmOpen} onOpenChange={setAssignConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận gán người thuê</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-700">
              Bạn có chắc muốn gán <span className="font-medium">{selectedUser?.name}</span> vào
              phòng <span className="font-medium">{roomSelected?.number}</span>?
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAssignConfirmOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirmAssign}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={assignTenantMutation.isPending}
            >
              {assignTenantMutation.isPending ? 'Đang gán...' : 'Xác nhận'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
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
              disabled={!pagination.hasPrev || isLoading}
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
              disabled={!pagination.hasNext || isLoading}
            >
              Tiếp
            </Button>
          </div>
        </div>
      )}

      {confirmOpen && (
        <ConfirmDialog
          open={confirmOpen}
          description={confirmMessage}
          confirmText="Xoá"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
          loading={deleteRoomMutation.isPending}
        />
      )}

      {tenantEditing && (
        <EditTenantDialog
          open={isOpenEditTenant}
          onOpenChange={setIsOpenEditTenant}
          userId={tenantEditing}
          onSubmit={handleSaveEditTenant}
        />
      )}

      {isOpenViewTenant && (
        <UserCard
          userId={tenantUserId}
          variant="dialog"
          open={isOpenViewTenant}
          onClose={() => setIsOpenViewTenant(false)}
        />
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default Rooms;
