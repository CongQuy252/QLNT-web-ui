import { ArrowLeft, Calendar, Download, Edit, FileText, Mail, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Mode, RoomStatus } from '@/constants/appConstants';
import { room, tenant } from '@/pages/roomDetails/mockData/data';
import { formatCurrency } from '@/utils/utils';

interface ImageTab {
  id: string;
  name: string;
  src: string;
}

interface RoomDetailsProps {
  mode: Mode;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ mode }) => {
  const router = useNavigate();

  const [selectedImageTab, setSelectedImageTab] = useState<string>('main');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const roomImages: ImageTab[] = [
    { id: 'main', name: 'Phòng chính', src: '/room-sample.jpg' },
    { id: 'main', name: 'Phòng chính', src: '/room-sample.jpg' },
    { id: 'main', name: 'Phòng chính', src: '/room-sample.jpg' },
  ];

  if (mode === Mode.owner) {
    // const handleClickEditRoomButton = () => {
    //   console.log('onClickEditRoomButton');
    // };
    // const handleClickMaintainRoomButton = () => {
    //   console.log('onClickMaintainRoomButton');
    // };
    // const handleClickDeleteRoomButton = () => {
    //   console.log('onClickDeleteRoomButton');
    // };
  }

  if (!room) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => router(-1)}
          className="gap-2 text-slate-700 border-slate-300 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Card className="p-6 text-center">
          <p className="text-slate-600">Không tìm thấy phòng</p>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };
    return badges[status] || 'bg-slate-100 text-slate-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Trống',
      occupied: 'Đã cho thuê',
      maintenance: 'Bảo trì',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router(-1)}
          className="gap-2 text-slate-700 border-slate-300 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 text-slate-700 border-slate-300 bg-transparent"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-red-600 border-red-300 bg-transparent hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Room Title and Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Phòng {room.number}</h1>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(room.status)}`}
          >
            {getStatusLabel(room.status)}
          </div>
        </div>
        <p className="text-slate-600">
          Tòa {room.building} - Tầng {room.floor}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <div className="relative bg-slate-900 aspect-video">
              <img
                src="/room-sample.jpg"
                alt="Phòng chính"
                className="object-cover h-full w-full"
              />
            </div>
            <div className="p-4 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-600 uppercase mb-3">Ảnh phòng</p>
              <div className="grid grid-cols-4 gap-2">
                {roomImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedImageTab === img.id ? 'border-slate-900' : 'border-slate-200'}`}
                    onClick={() => setSelectedImageTab(img.id)}
                  >
                    <img
                      src={img.src || '/placeholder.svg'}
                      alt={img.name}
                      className="object-cover h-full w-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Room Details */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin phòng</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Diện tích</p>
                  <p className="text-xl font-semibold text-slate-900">{room.area} m²</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Giá thuê/tháng</p>
                  <p className="text-xl font-semibold text-slate-900">
                    {formatCurrency(room.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Loại phòng</p>
                  <p className="text-base text-slate-900">Phòng đơn</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Số điện thoại</p>
                  <p className="text-base text-slate-900">0901234567</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Tiện ích</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Điều hòa', 'Nước nóng', 'WiFi miễn phí', 'Giặt tự động'].map((utility) => (
                  <div key={utility} className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                    {utility}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Mô tả</h3>
              <p className="text-slate-700 leading-relaxed">
                {room.description ||
                  'Phòng trọ hiện đại với đầy đủ tiện nghi. Có cửa sổ để gió lưu thông. Nước nóng, điều hòa, WiFi miễn phí. Phù hợp cho sinh viên hoặc người đi làm.'}
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant Info */}
          {room.status === RoomStatus.occupied && tenant ? (
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Thông tin người thuê</h2>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600 mb-1">Tên</p>
                  <p className="font-medium text-slate-900">{tenant.name}</p>
                </div>

                <div>
                  <p className="text-slate-600 mb-1">Email</p>
                  <a
                    href={`mailto:${tenant.email}`}
                    className="font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {tenant.email}
                  </a>
                </div>

                <div>
                  <p className="text-slate-600 mb-1">Số điện thoại</p>
                  <a
                    href={`tel:${tenant.phone}`}
                    className="font-medium text-slate-900 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {tenant.phone}
                  </a>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <p className="text-slate-600 mb-1">Ngày vào</p>
                  <p className="font-medium text-slate-900 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {/* {tenant.moveInDate} */}
                    25/02/2026
                  </p>
                </div>

                <div>
                  <p className="text-slate-600 mb-1">Hết hạn hợp đồng</p>
                  <p className="font-medium text-slate-900 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {tenant.contractEndDate}
                  </p>
                </div>

                <div>
                  <p className="text-slate-600 mb-1">Ngành nghề</p>
                  {/* <p className="font-medium text-slate-900">{tenant.occupation}</p> */}
                  <p className="font-medium text-slate-900">CNTT</p>
                </div>
              </div>

              {/* ID Card Section */}
              <div className="border-t border-slate-200 pt-4">
                <p className="text-slate-600 text-sm mb-2 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  CCCD/CMND
                </p>
                <div className="relative bg-slate-100 aspect-video rounded-md overflow-hidden border border-slate-200 mb-3">
                  <img
                    src="/id-card-sample.jpg"
                    alt="CCCD"
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Số CCCD:</span> {tenant.idNumber}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-slate-700 border-slate-300 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    Tải ảnh CCCD
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Chỉnh sửa thông tin
              </Button>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-slate-600 mb-4">Phòng hiện chưa có người thuê</p>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                Tìm người thuê
              </Button>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="p-6 space-y-3">
            <h3 className="font-semibold text-slate-900">Thông tin thanh toán</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Tháng hiện tại:</span>
                <span className="font-medium text-slate-900">Tháng 2/2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Trạng thái:</span>
                <span className="font-medium text-green-600">Đã thanh toán</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Hạn thanh toán:</span>
                <span className="font-medium text-slate-900">05/02/2025</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2 text-slate-700 border-slate-300 bg-transparent"
            >
              <FileText className="w-4 h-4" />
              Xem hóa đơn
            </Button>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin phòng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Giá thuê/tháng</label>
              <Input type="number" defaultValue={room.price} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Diện tích (m²)</label>
              <Input type="number" defaultValue={room.area} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                defaultValue={room.description}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                rows={4}
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
              <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomDetails;
