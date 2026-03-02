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
            <label className="text-sm font-medium">Tiền phòng</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.roomFee || 0}
              onChange={(e) => handleChange('roomFee', Number(e.target.value))}
            />
          </div>

          {/* Điện */}
          <div>
            <label className="text-sm font-medium">Chỉ số điện cũ</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.electricityPrevious || 0}
              onChange={(e) => handleChange('electricityPrevious', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Chỉ số điện mới</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.electricityCurrent || 0}
              onChange={(e) => handleChange('electricityCurrent', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Đơn giá điện</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.electricityUnitPrice || 0}
              onChange={(e) => handleChange('electricityUnitPrice', Number(e.target.value))}
            />
          </div>

          {/* Nước */}
          <div>
            <label className="text-sm font-medium">Chỉ số nước cũ</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.waterPrevious || 0}
              onChange={(e) => handleChange('waterPrevious', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Chỉ số nước mới</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.waterCurrent || 0}
              onChange={(e) => handleChange('waterCurrent', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Đơn giá nước</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.waterUnitPrice || 0}
              onChange={(e) => handleChange('waterUnitPrice', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phí internet mới</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.internetFee || 0}
              onChange={(e) => handleChange('waterUnitPrice', Number(e.target.value))}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Phí gửi xe mới</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.internetFee || 0}
              onChange={(e) => handleChange('parkingFee', Number(e.target.value))}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Phí khác</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={form.otherFee || 0}
              onChange={(e) => handleChange('otherFee', Number(e.target.value))}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Ghi chú</label>
            <textarea
              className="w-full border p-2 rounded"
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
