import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Room } from '@/types/room';
import type { Tenant } from '@/types/tenant';

type ServiceItem = {
  price: number;
  quantity: number;
};

type InvoiceData = {
  tenantId: string;
  roomId: string;
  month: string;
  dueDate: string;
  notes: string;
  amount: number;
  services: Record<string, ServiceItem>;
};

type Props = {
  tenants: Tenant[];
  getRoomById: (id: string) => Room | undefined;
  onSubmit: (invoice: InvoiceData) => void;
};

export default function CreateInvoiceDialog({ tenants, getRoomById, onSubmit }: Props) {
  const [invoice, setInvoice] = useState<InvoiceData>({
    tenantId: '',
    roomId: '',
    month: new Date().toISOString().slice(0, 7),
    dueDate: new Date().toISOString().split('T')[0],
    notes: '',
    amount: 0,
    services: {
      electricity: { price: 3500, quantity: 0 },
      water: { price: 15000, quantity: 0 },
      parking: { price: 100000, quantity: 0 },
      wifi: { price: 80000, quantity: 1 },
      garbage: { price: 20000, quantity: 1 },
    },
  });

  const calculateTotal = (services: Record<string, ServiceItem>) =>
    Object.values(services).reduce((sum, s) => sum + s.price * s.quantity, 0);

  const handleServiceChange = (key: string, field: 'price' | 'quantity', value: number) => {
    setInvoice((prev) => {
      const updated = {
        ...prev.services,
        [key]: { ...prev.services[key], [field]: value },
      };

      return {
        ...prev,
        services: updated,
        amount: calculateTotal(updated),
      };
    });
  };

  const handleSelectTenant = (tenantId: string) => {
    const tenant = tenants.find((t) => t.user._id === tenantId);
    if (!tenant) return;

    const room = getRoomById(tenant.room._id);

    setInvoice((prev) => ({
      ...prev,
      tenantId,
      roomId: tenant.room._id,
      amount: room?.price ?? 0,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...invoice,
      amount: calculateTotal(invoice.services),
    });
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
          <option key={t.user._id} value={t.user._id}>
            {t.user.name}
          </option>
        ))}
      </select>

      {/* Room info */}
      {invoice.roomId && (
        <div className="p-3 bg-slate-50 border rounded">
          Phòng: {getRoomById(invoice.roomId)?.number}
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
      <div className="space-y-2">
        {Object.entries(invoice.services).map(([key, item]) => (
          <div key={key} className="grid grid-cols-3 gap-2 items-center">
            <span>{labels[key]}</span>

            <Input
              type="number"
              value={item.price}
              onChange={(e) => handleServiceChange(key, 'price', Number(e.target.value))}
            />

            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => handleServiceChange(key, 'quantity', Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="font-semibold text-right">
        Tổng tiền: {invoice.amount.toLocaleString()} VNĐ
      </div>

      {/* Notes */}
      <Textarea
        placeholder="Ghi chú"
        value={invoice.notes}
        onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Tạo hoá đơn
      </Button>
    </div>
  );
}
