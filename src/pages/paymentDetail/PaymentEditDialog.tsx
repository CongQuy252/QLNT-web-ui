/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onClose: () => void;
  payment: any;
  onSubmit: (data: any) => void;
}

export default function PaymentEditDialog({ open, onClose, payment, onSubmit }: Props) {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (payment) {
      setForm(payment);
    }
  }, [payment]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSubmit(form);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none rounded-none p-6">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hóa đơn</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          {/* Tiền phòng */}
          <div>
            <label htmlFor="roomFee" className="text-sm font-medium">Tiền phòng</label>
            <input
              id="roomFee"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập tiền phòng"
              value={form.roomFee || 0}
              onChange={(e) => handleChange('roomFee', Number(e.target.value))}
            />
          </div>

          {/* Điện */}
          <div>
            <label htmlFor="electricityPrevious" className="text-sm font-medium">Chỉ số điện cũ</label>
            <input
              id="electricityPrevious"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập chỉ số điện cũ"
              value={form.electricityPrevious || 0}
              onChange={(e) => handleChange('electricityPrevious', Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="electricityCurrent" className="text-sm font-medium">Chỉ số điện mới</label>
            <input
              id="electricityCurrent"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập chỉ số điện mới"
              value={form.electricityCurrent || 0}
              onChange={(e) => handleChange('electricityCurrent', Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="electricityUnitPrice" className="text-sm font-medium">Đơn giá điện</label>
            <input
              id="electricityUnitPrice"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập đơn giá điện"
              value={form.electricityUnitPrice || 0}
              onChange={(e) => handleChange('electricityUnitPrice', Number(e.target.value))}
            />
          </div>

          {/* Nước */}
          <div>
            <label htmlFor="waterPrevious" className="text-sm font-medium">Chỉ số nước cũ</label>
            <input
              id="waterPrevious"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập chỉ số nước cũ"
              value={form.waterPrevious || 0}
              onChange={(e) => handleChange('waterPrevious', Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="waterCurrent" className="text-sm font-medium">Chỉ số nước mới</label>
            <input
              id="waterCurrent"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập chỉ số nước mới"
              value={form.waterCurrent || 0}
              onChange={(e) => handleChange('waterCurrent', Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="waterUnitPrice" className="text-sm font-medium">Đơn giá nước</label>
            <input
              id="waterUnitPrice"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập đơn giá nước"
              value={form.waterUnitPrice || 0}
              onChange={(e) => handleChange('waterUnitPrice', Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="internetFee" className="text-sm font-medium">Phí internet mới</label>
            <input
              id="internetFee"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập phí internet"
              value={form.internetFee || 0}
              onChange={(e) => handleChange('internetFee', Number(e.target.value))}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="parkingFee" className="text-sm font-medium">Phí gửi xe mới</label>
            <input
              id="parkingFee"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập phí gửi xe"
              value={form.parkingFee || 0}
              onChange={(e) => handleChange('parkingFee', Number(e.target.value))}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="otherFee" className="text-sm font-medium">Phí khác</label>
            <input
              id="otherFee"
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Nhập phí khác"
              value={form.otherFee || 0}
              onChange={(e) => handleChange('otherFee', Number(e.target.value))}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="note" className="text-sm font-medium">Ghi chú</label>
            <textarea
              id="note"
              className="w-full border p-2 rounded"
              placeholder="Nhập ghi chú"
              value={form.note || ''}
              onChange={(e) => handleChange('note', e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Hủy
          </Button>

          <Button onClick={handleSave} className="flex-1">
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
