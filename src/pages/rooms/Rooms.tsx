import { Edit, Home, Trash2 } from 'lucide-react';
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
import { getStatusBadge, getStatusLabel } from '@/pages/rooms/roomConstants';
import { useRooms } from '@/pages/rooms/useRooms';
import type { Room } from '@/types/room';
import { formatCurrency } from '@/utils/utils';

const Rooms = () => {
  const {
    totalItems,
    isLoading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editRoom,
    setEditRoom,
    handleUpdateRoom,
    updateRoomMutation,
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
  } = useRooms();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="text-slate-600 mt-2">{`Tổng cộng ${totalItems} phòng`}</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
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
                <label className="text-sm font-medium text-slate-700">Trạng thái</label>
                <select
                  value={editRoom?.status || RoomStatus.available}
                  onChange={(e) =>
                    editRoom && setEditRoom({ ...editRoom, status: e.target.value as RoomStatus })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  aria-label="Trạng thái phòng"
                >
                  <option value={RoomStatus.available}>
                    {getStatusLabel(RoomStatus.available)}
                  </option>
                  <option value={RoomStatus.maintenance}>
                    {getStatusLabel(RoomStatus.maintenance)}
                  </option>
                  <option value={RoomStatus.occupied}>{getStatusLabel(RoomStatus.occupied)}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mô tả</label>
                <textarea
                  placeholder="Mô tả chi tiết về phòng..."
                  value={editRoom?.description || ''}
                  onChange={(e) =>
                    editRoom && setEditRoom({ ...editRoom, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  rows={3}
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
            const tenant = room.currentTenant ? 'abc' : undefined;
            return (
              <Card key={room.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
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
                              Tính năng Thêm người thuê phòng sẽ được cập nhật trong phiên bản tiếp
                              theo
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-slate-700 border-slate-300 bg-transparent"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => handleEditRoom(room)}
                    />
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
    </div>
  );
};

export default Rooms;
