import { Edit, Home, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirmDialog/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { ToastContainer } from '@/components/ui/toast/Toast';
import { Path } from '@/constants/appConstants';
import { useToast } from '@/hooks/useToast';
import { getStatusBadge, getStatusLabel } from '@/pages/rooms/roomConstants';
import { useRooms } from '@/pages/rooms/useRooms';
import { ROOMSTATUS, type Room } from '@/types/room';
import { formatCurrency } from '@/utils/utils';

const Rooms = () => {
  const navigate = useNavigate();
  const { toasts } = useToast();
  const {
    totalItems,
    isLoading,
    error,
    filteredRooms,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    setCurrentPage,
    deleteRoomMutation,
    setConfirmOpen,
    handleConfirmDelete,
    handleAskDeleteRoom,
    confirmMessage,
    confirmOpen,
  } = useRooms();

  const handleEditRoom = (room: Room) => {
    navigate(`/rooms/${room._id}/edit`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản lý phòng</h1>
          <p className="text-slate-600 mt-2">{`Tổng cộng ${totalItems} phòng`}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-3">
        <div className="relative flex-1">
          <Input
            placeholder="Tìm kiếm ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
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
                  if (status === '0') {
                    navigate(`/${Path.rooms}`);
                  }
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
              const representativeMember = room.members.find((member) => member.isRepresentative);

              return (
                <Card key={room._id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900 break-normal">
                          {room.number}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Tòa {room.buildingName || room.buildingId}
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

                    <div
                      className={`p-3 ${representativeMember ? 'bg-slate-50' : 'flex-1'} rounded-lg`}
                    >
                      {representativeMember && room.status === ROOMSTATUS.OCCUPIED && (
                        <div>
                          <p className="font-semibold text-slate-900 text-ellipsis">
                            {representativeMember.name}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 text-ellipsis">
                            {representativeMember.phone}
                          </p>{' '}
                        </div>
                      )}
                    </div>

                    {room.description && (
                      <p className="text-sm text-slate-600 italic break-all">
                        "{room.description}"
                      </p>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-slate-200">
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

      {/* Toast Container */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default Rooms;
