import { Edit, Home, Trash2 } from 'lucide-react';
import { FaUserPlus } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirmDialog/ConfirmDialog';
import { ToastContainer } from '@/components/ui/toast/Toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { RoomStatus } from '@/constants/appConstants';
import { useMobile } from '@/hooks/useMobile';
import { useToast } from '@/hooks/useToast';
import { getStatusBadge, getStatusLabel } from '@/pages/rooms/roomConstants';
import { useRooms } from '@/pages/rooms/useRooms';
import type { Room } from '@/types/room';
import { formatCurrency } from '@/utils/utils';

const Rooms = () => {
  const isMobile = useMobile();
  const { toasts } = useToast();
  const {
    totalItems,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editRoom,
    setEditRoom,
    handleUpdateRoom,
    updateRoomMutation,
    handleAssignTenant,
    handleConfirmAssign,
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
    totalFloors,
    setConfirmOpen,
    handleConfirmDelete,
    handleAskDeleteRoom,
    confirmMessage,
    confirmOpen,
    roomSelected,
    handleOpenAddTenant,
    assignTenantMutation,
  } = useRooms();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="text-slate-600 mt-2">{`Tổng cộng ${totalItems} phòng`}</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-screen h-screen max-w-none rounded-none sm:h-auto sm:max-w-lg sm:rounded-lg top-0 translate-y-0 flex flex-col">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa phòng {editRoom?.number}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Số phòng</label>
                <Input
                  placeholder="VD: 101, 102..."
                  value={editRoom?.number || ''}
                  onChange={(e) => editRoom && setEditRoom({ ...editRoom, number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tầng</label>
                  <select
                    value={editRoom?.floor || 1}
                    onChange={(e) =>
                      editRoom && setEditRoom({ ...editRoom, floor: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    aria-label="Tầng"
                  >
                    {Array.from({ length: totalFloors }, (_, i) => i + 1).map((f) => (
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
                    value={editRoom?.area || 0}
                    onChange={(e) =>
                      editRoom && setEditRoom({ ...editRoom, area: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Giá thuê/tháng</label>
                  <Input
                    type="number"
                    min="100000"
                    step="100000"
                    value={editRoom?.price || 0}
                    onChange={(e) =>
                      editRoom && setEditRoom({ ...editRoom, price: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Trạng thái</Label>

                <Select
                  value={editRoom?.status ?? RoomStatus.available}
                  onValueChange={(value) =>
                    editRoom && setEditRoom({ ...editRoom, status: value as RoomStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái phòng" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={RoomStatus.available}>
                      {getStatusLabel(RoomStatus.available)}
                    </SelectItem>

                    <SelectItem value={RoomStatus.maintenance}>
                      {getStatusLabel(RoomStatus.maintenance)}
                    </SelectItem>

                    <SelectItem value={RoomStatus.occupied}>
                      {getStatusLabel(RoomStatus.occupied)}
                    </SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="flex gap-2 pt-4 border-t border-slate-200">
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

      <div className="flex flex-col md:flex-row gap-4 mt-3 w-full">
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
            Nhập số phòng hoặc tên tòa nhà để tìm kiếm
            <div
              className="absolute left-1/2 top-full -translate-x-1/2
                    border-6 border-transparent border-t-gray-900"
            ></div>
          </div>
        </div>
        <div className="flex gap-2 mb-5 w-full overflow-x-auto">
          {[RoomStatus.all, RoomStatus.available, RoomStatus.maintenance, RoomStatus.occupied].map(
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

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto flex-1">
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
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">{room.number}</h3>
                      <p className="text-sm text-slate-600">
                        Tòa {room.building} - Tầng {room.floor}
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

                  {tenant && room.status === RoomStatus.occupied && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Người thuê hiện tại</p>
                      <p className="font-semibold text-slate-900">{tenant.name}</p>
                      <p className="text-xs text-slate-600 mt-1">{tenant.email}</p>
                    </div>
                  )}

                  {room.description && (
                    <p className="text-sm text-slate-600 italic">"{room.description}"</p>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    {room.status === RoomStatus.available && (
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

                    {room.status !== RoomStatus.occupied && (
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
              Bạn có chắc muốn gán <span className="font-medium">{selectedUser?.name}</span> vào phòng <span className="font-medium">{roomSelected?.number}</span>?
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setAssignConfirmOpen(false)}
            >
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

      {!isLoading && !error && filteredRooms.length === 0 && (
        <Card className="p-12 bg-white text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Không tìm thấy phòng nào phù hợp</p>
        </Card>
      )}

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
        />
      )}
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default Rooms;
