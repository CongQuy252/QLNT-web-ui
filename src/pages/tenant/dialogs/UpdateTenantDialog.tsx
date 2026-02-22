import { Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Room } from '@/types/room';
import type { UpdateTenantRequest } from '@/types/user';

interface UpdateTenantDialogProps {
  isOpen: boolean;
  tenant: UpdateTenantRequest;
  rooms: Room[];
  onClose: () => void;
  onChange: (tenant: UpdateTenantRequest) => void;
  onSave: () => void;
}

const UpdateTenantDialog: React.FC<UpdateTenantDialogProps> = ({
  isOpen,
  tenant,
  // rooms,
  onClose,
  onChange,
  onSave,
}) => {
  const updateField = (field: keyof UpdateTenantRequest, value: string | number) => {
    onChange({ ...tenant, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col w-full h-full max-w-none rounded-none md:max-w-lg md:h-auto md:rounded-lg">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Chỉnh sửa thông tin người thuê</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ tên</label>
            <Input value={tenant.name} onChange={(e) => updateField('name', e.target.value)} />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={tenant.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input value={tenant.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
          </div>

          {/* Room */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Phòng</label>
            <select
              value={tenant.roomId || ''}
              onChange={(e) => updateField('roomId', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Phòng {room.number} - Tòa {room.building}
                </option>
              ))}
            </select>
          </div> */}

          {/* Occupation */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Nghề nghiệp</label>
            <Input
              value={tenant.occupation}
              onChange={(e) => updateField('occupation', e.target.value)}
            />
          </div> */}

          {/* Dates */}
          {/* <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={tenant.contractStartDate || ''}
              onChange={(e) => updateField('contractStartDate', e.target.value)}
            />
            <Input
              type="date"
              value={tenant.contractEndDate || ''}
              onChange={(e) => updateField('contractEndDate', e.target.value)}
            />
          </div> */}

          {/* Buttons */}
          <div className="border-t pt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              icon={<X className="w-4 h-4 mr-2" />}
            />
            <Button className="flex-1" onClick={onSave} icon={<Save className="w-4 h-4 mr-2" />} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTenantDialog;
