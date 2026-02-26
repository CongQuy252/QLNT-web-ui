import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { InvoiceForm } from '@/types/payment';
import type { Room } from '@/types/room';
import type { Tenant } from '@/types/tenant';

type ServiceItem = {
  price: number;
  quantity: number;
};

type Props = {
  tenants: Tenant[];
  getRoomById: (id: string) => Room | undefined;
  onSubmit: (invoice: InvoiceForm) => void;
};

export default function CreateInvoiceDialog({ tenants, getRoomById, onSubmit }: Props) {
  const [invoice, setInvoice] = useState<
    InvoiceForm & {
      services: Record<string, ServiceItem>;
    }
  >({
    tenantId: '',
    roomId: '',
    month: new Date().toISOString().slice(0, 7),
    dueDate: new Date().toISOString().split('T')[0],
    amount: 0,

    electricityAmount: 0,
    waterAmount: 0,
    internetFee: 0,
    serviceFee: 0,

    electricityUnitPrice: 0,
    electricityPrevious: 0,
    electricityCurrent: 0,

    waterUnitPrice: 0,
    waterPrevious: 0,
    waterCurrent: 0,

    roomFee: 0,

    services: {
      electricity: { price: 0, quantity: 0 },
      water: { price: 0, quantity: 0 },
      parking: { price: 0, quantity: 0 },
      wifi: { price: 0, quantity: 0 },
      garbage: { price: 0, quantity: 0 },
    },
  });

  const buildInvoicePayload = (): InvoiceForm => {
    const electricity = invoice.services.electricity;
    const water = invoice.services.water;

    const electricityUsage = electricity.quantity - invoice.electricityPrevious;

    const electricityAmount = electricity.price * Math.max(electricityUsage, 0);
    const waterAmount = water.price * water.quantity;

    const serviceFee = invoice.services.garbage.price * invoice.services.garbage.quantity;

    const internetFee = invoice.services.wifi.price * invoice.services.wifi.quantity;

    const roomFee = getRoomById(invoice.roomId)?.price ?? 0;

    const total = roomFee + electricityAmount + waterAmount + serviceFee + internetFee;

    return {
      tenantId: invoice.tenantId,
      roomId: invoice.roomId,
      month: invoice.month,

      roomFee,

      electricityUnitPrice: electricity.price,
      electricityPrevious: 0,
      electricityCurrent: electricity.quantity,
      electricityAmount,

      waterUnitPrice: water.price,
      waterPrevious: 0,
      waterCurrent: water.quantity,
      waterAmount,

      internetFee,
      serviceFee,

      amount: total,

      dueDate: invoice.dueDate,
    };
  };

  const calculateTotal = (services: Record<string, ServiceItem>, roomFee: number) =>
    Object.values(services).reduce((sum, s) => sum + s.price * s.quantity, 0) + roomFee;

  const handleServiceChange = (key: string, field: 'price' | 'quantity', value: number) => {
    setInvoice((prev) => {
      const updated = {
        ...prev.services,
        [key]: { ...prev.services[key], [field]: value },
      };

      const roomFee = getRoomById(prev.roomId)?.price ?? 0;

      return {
        ...prev,
        services: updated,
        amount: calculateTotal(updated, roomFee),
      };
    });
  };

  const handleSelectTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t._id === tenantId);
    if (!tenant) return;

    const room = getRoomById(tenant.roomId._id);

    setInvoice((prev) => ({
      ...prev,
      tenantId,
      roomId: room?._id || '',
    }));
  };

  const handleSubmit = () => {
    if (!invoice.tenantId || !invoice.roomId) return;

    onSubmit(buildInvoicePayload());
  };

  const labels: Record<string, string> = {
    electricity: 'Tiền điện',
    water: 'Tiền nước',
    parking: 'Gửi xe',
    wifi: 'Wifi',
    garbage: 'Rác',
  };

  return (
    <div className="space-y-4">
      {/* Tenant */}
      <select
        value={invoice.tenantId}
        onChange={(e) => handleSelectTenant(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">-- Chon nguoi thue --</option>
        {tenants.map((t) => (
          <option key={t._id} value={t._id}>
            {t.userId.name}
          </option>
        ))}
      </select>

      {/* Room info */}
      {invoice.roomId && (
        <div className="p-3 bg-slate-50 border rounded">
          Phòng: {getRoomById(invoice.roomId)?.number}
          <br />
          Giá phòng: {getRoomById(invoice.roomId)?.price.toLocaleString()} VNĐ
        </div>
      )}

      {/* Month & Due */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="month"
          value={invoice.month}
          onChange={(e) => setInvoice({ ...invoice, month: e.target.value })}
        />
        <Input
          type="date"
          value={invoice.dueDate}
          onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
        />
      </div>

      {/* Services */}
      {/* ELECTRICITY */}
      <div className="border rounded p-3 space-y-2">
        <div className="font-semibold">⚡ Tiền điện</div>

        <Input
          // type="number"
          placeholder="Giá điện"
          value={invoice.services.electricity.price}
          onChange={(e) => handleServiceChange('electricity', 'price', Number(e.target.value))}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Chỉ số cũ"
            value={invoice.electricityPrevious}
            onChange={(e) =>
              setInvoice({ ...invoice, electricityPrevious: Number(e.target.value) })
            }
          />

          <Input
            type="number"
            placeholder="Chỉ số mới"
            value={invoice.services.electricity.quantity}
            onChange={(e) => handleServiceChange('electricity', 'quantity', Number(e.target.value))}
          />
        </div>
      </div>

      {/* WATER */}
      <div className="border rounded p-3 space-y-2">
        <div className="font-semibold">💧 Tiền nước</div>

        <Input
          type="number"
          placeholder="Giá nước"
          value={invoice.services.water.price}
          onChange={(e) => handleServiceChange('water', 'price', Number(e.target.value))}
        />

        <Input
          type="number"
          placeholder="Số lượng (m³)"
          value={invoice.services.water.quantity}
          onChange={(e) => handleServiceChange('water', 'quantity', Number(e.target.value))}
        />
      </div>

      {/* OTHER SERVICES */}
      <div className="border rounded p-3 space-y-2">
        <div className="font-semibold">🧰 Dịch vụ khác</div>

        {['wifi', 'garbage', 'parking'].map((key) => (
          <div key={key} className="grid grid-cols-2 gap-2 items-center">
            <span>{labels[key]}</span>

            <Input
              type="number"
              placeholder="Giá"
              value={invoice.services[key].price}
              onChange={(e) => handleServiceChange(key, 'price', Number(e.target.value))}
            />

            <Input
              type="number"
              placeholder="Số lượng"
              value={invoice.services[key].quantity}
              onChange={(e) => handleServiceChange(key, 'quantity', Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="font-semibold text-right">
        Tổng tiền: {invoice.amount.toLocaleString()} VNĐ
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Tạo hoá đơn
      </Button>
    </div>
  );
}
