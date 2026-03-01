import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { InvoiceForm } from '@/types/payment';
import type { Room } from '@/types/room';

type Props = {
  occupiedRooms: Room[];
  getRoomById: (id: string) => Room | undefined;
  onSubmit: (invoice: InvoiceForm) => void;
};

type InvoiceState = {
  tenantId: string;
  roomId: string;
  month: string;
  dueDate: string;
  notes?: string;

  electricityPrevious: number;
  electricityCurrent: number;

  waterPrevious: number;
  waterCurrent: number;

  otherFee: number;
};

export default function CreateInvoiceDialog({ occupiedRooms, getRoomById, onSubmit }: Props) {
  const [invoice, setInvoice] = useState<InvoiceState>({
    tenantId: '',
    roomId: '',
    month: new Date().toISOString().slice(0, 7),
    dueDate: new Date().toISOString().slice(0, 10),

    electricityPrevious: 0,
    electricityCurrent: 0,

    waterPrevious: 0,
    waterCurrent: 0,

    otherFee: 0,

    notes: '',
  });

  const selectedRoom = useMemo(() => getRoomById(invoice.roomId), [invoice.roomId, getRoomById]);

  const totalAmount = useMemo(() => {
    const room = getRoomById(invoice.roomId);
    if (!room) return 0;

    const electricityUsage = invoice.electricityCurrent - invoice.electricityPrevious;

    const waterUsage = invoice.waterCurrent - invoice.waterPrevious;

    const electricityAmount = Math.max(electricityUsage, 0) * (room.electricityUnitPrice || 0);

    const waterAmount = Math.max(waterUsage, 0) * (room.waterUnitPrice || 0);

    const internetFee = room.internetFee || 0;

    const parkingFee = room.parkingFee || 0;

    const serviceFee = room.serviceFee || 0;

    return (
      room.price +
      electricityAmount +
      waterAmount +
      internetFee +
      parkingFee +
      serviceFee +
      invoice.otherFee
    );
  }, [
    getRoomById,
    invoice.electricityCurrent,
    invoice.electricityPrevious,
    invoice.otherFee,
    invoice.roomId,
    invoice.waterCurrent,
    invoice.waterPrevious,
  ]);

  const buildInvoicePayload = (): InvoiceForm => {
    const room = getRoomById(invoice.roomId);
    if (!room) throw new Error('Room not found');

    const electricityUsage = invoice.electricityCurrent - invoice.electricityPrevious;

    const waterUsage = invoice.waterCurrent - invoice.waterPrevious;

    const electricityAmount = Math.max(electricityUsage, 0) * (room.electricityUnitPrice || 0);

    const waterAmount = Math.max(waterUsage, 0) * (room.waterUnitPrice || 0);

    const internetFee = room.internetFee || 0;

    const parkingFee = room.parkingFee || 0;

    const serviceFee = room.serviceFee || 0;

    const total =
      room.price +
      electricityAmount +
      waterAmount +
      internetFee +
      parkingFee +
      serviceFee +
      invoice.otherFee;

    return {
      tenantId: invoice.tenantId,
      roomId: invoice.roomId,
      month: invoice.month,
      dueDate: invoice.dueDate,
      notes: invoice.notes,

      rentAmount: room.price,

      electricityPrevious: invoice.electricityPrevious,
      electricityCurrent: invoice.electricityCurrent,
      electricityAmount,

      waterPrevious: invoice.waterPrevious,
      waterCurrent: invoice.waterCurrent,
      waterAmount,

      internetFeeAmount: internetFee,
      parkingFeeAmount: parkingFee,
      serviceFeeAmount: serviceFee,
      otherFee: invoice.otherFee,

      amount: total,
    };
  };

  const handleSelectRoom = (roomId: string) => {
    const room = occupiedRooms.find((r) => r._id === roomId);
    if (!room) return;

    setInvoice((prev) => ({
      ...prev,
      roomId,
      tenantId: room.currentTenant?._id || '',

      // reset lại chỉ số khi đổi phòng
      electricityPrevious: 0,
      electricityCurrent: 0,
      waterPrevious: 0,
      waterCurrent: 0,

      otherFee: 0,
    }));
  };

  const handleSubmit = () => {
    if (!invoice.roomId || !invoice.tenantId) return;

    const payload = buildInvoicePayload();

    onSubmit(payload);
  };

  return (
    <div className="space-y-6">
      {/* Room Selection */}
      <div className="space-y-2">
        <Label htmlFor="room-select" className="text-sm font-semibold text-slate-700">
          Chọn phòng
        </Label>
        <select
          id="room-select"
          value={invoice.roomId}
          onChange={(e) => handleSelectRoom(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          title="Chọn phòng đã có người thuê"
        >
          <option value="">-- Chọn phòng --</option>
          {occupiedRooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.number} - {room.currentTenant?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Room Info Card */}
      {invoice.roomId && (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🏠</span>
            </div>
            <h3 className="font-semibold text-blue-900">Thông tin phòng</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Phòng:</span>
              <span className="ml-2 font-medium">{getRoomById(invoice.roomId)?.number}</span>
            </div>
            <div>
              <span className="text-slate-600">Giá phòng:</span>
              <span className="ml-2 font-medium">
                {getRoomById(invoice.roomId)?.price?.toLocaleString()} VNĐ
              </span>
            </div>
            <div>
              <span className="text-slate-600">Giá điện:</span>
              <span className="ml-2 font-medium">
                {getRoomById(invoice.roomId)?.electricityUnitPrice?.toLocaleString()} VNĐ/kWh
              </span>
            </div>
            <div>
              <span className="text-slate-600">Giá nước:</span>
              <span className="ml-2 font-medium">
                {getRoomById(invoice.roomId)?.waterUnitPrice?.toLocaleString()} VNĐ/m³
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Period Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-slate-700">Kỳ thanh toán</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="month" className="text-xs text-slate-600">
              Tháng
            </Label>
            <Input
              id="month"
              type="month"
              value={invoice.month}
              onChange={(e) => setInvoice({ ...invoice, month: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="due-date" className="text-xs text-slate-600">
              Hạn thanh toán
            </Label>
            <Input
              id="due-date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Chi tiết dịch vụ</h3>

        {/* ELECTRICITY */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Tiền điện</h4>
              {invoice.roomId && getRoomById(invoice.roomId)?.electricityUnitPrice && (
                <p className="text-xs text-slate-600">
                  Giá mặc định:{' '}
                  {getRoomById(invoice.roomId)?.electricityUnitPrice?.toLocaleString()} VNĐ/kWh
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-600">Chỉ số cũ</Label>
              <Input
                type="number"
                placeholder="0"
                value={invoice.electricityPrevious}
                onChange={(e) =>
                  setInvoice({ ...invoice, electricityPrevious: Number(e.target.value) })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Chỉ số mới</Label>
              <Input
                type="number"
                placeholder="0"
                value={invoice.electricityCurrent}
                onChange={(e) =>
                  setInvoice({ ...invoice, electricityCurrent: Number(e.target.value) })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* WATER */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">💧</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Tiền nước</h4>
              {invoice.roomId && getRoomById(invoice.roomId)?.waterUnitPrice && (
                <p className="text-xs text-slate-600">
                  Giá mặc định: {getRoomById(invoice.roomId)?.waterUnitPrice?.toLocaleString()}{' '}
                  VNĐ/m³
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-600">Chỉ số cũ</Label>
              <Input
                type="number"
                placeholder="0"
                value={invoice.waterPrevious}
                onChange={(e) => setInvoice({ ...invoice, waterPrevious: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">Chỉ số mới</Label>
              <Input
                type="number"
                placeholder="0"
                value={invoice.waterCurrent}
                onChange={(e) => setInvoice({ ...invoice, waterCurrent: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* OTHER SERVICES */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🧰</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Dịch vụ khác</h4>
            </div>
          </div>

          <div className="space-y-4">
            {/* Other Fee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-16 text-sm font-medium">Phí khác</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={invoice.otherFee || 0}
                  onChange={(e) => setInvoice({ ...invoice, otherFee: Number(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-600">VNĐ</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium">Wifi</span>
                {selectedRoom?.internetFee ? (
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {selectedRoom.internetFee.toLocaleString()} VNĐ
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Không áp dụng</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium">Gửi xe</span>
                {selectedRoom?.parkingFee ? (
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {selectedRoom.parkingFee.toLocaleString()} VNĐ
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Không áp dụng</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-24 text-sm font-medium">Phí dịch vụ</span>
                {selectedRoom?.serviceFee ? (
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {selectedRoom.serviceFee.toLocaleString()} VNĐ
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Không áp dụng</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-800">Tổng cộng:</span>
            <span className="text-2xl font-bold text-blue-600">
              {totalAmount.toLocaleString()} VNĐ
            </span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">
          Ghi chú
        </Label>
        <Textarea
          value={invoice.notes}
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          placeholder="Nhập ghi chú về thanh toán (không bắt buộc)..."
          className="mt-1 h-20 resize-none border-slate-300"
          maxLength={200}
        />
      </div>

      {/* Submit Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        onClick={handleSubmit}
      >
        Tạo hóa đơn
      </Button>
    </div>
  );
}
