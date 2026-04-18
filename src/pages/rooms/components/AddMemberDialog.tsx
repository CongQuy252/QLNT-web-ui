import { Car, IdCard, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Member } from '@/types/room';

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: Member) => void;
  editingMember?: Member | null;
}

const AddMemberDialog = ({
  open,
  onOpenChange,
  onAddMember,
  editingMember,
}: AddMemberDialogProps) => {
  const [formData, setFormData] = useState<Omit<Member, 'userId'>>({
    name: editingMember?.name || '',
    phone: editingMember?.phone || '',
    licensePlate: editingMember?.licensePlate || '',
    cccdImages: {
      front: {
        url: editingMember?.cccdImages.front.url || '',
        publicId: editingMember?.cccdImages.front.publicId || '',
      },
      back: {
        url: editingMember?.cccdImages.back.url || '',
        publicId: editingMember?.cccdImages.back.publicId || '',
      },
    },
    isRepresentative: editingMember?.isRepresentative || false,
  });

  useEffect(() => {
    if (open) {
      if (editingMember) {
        setFormData({
          name: editingMember.name,
          phone: editingMember.phone,
          licensePlate: editingMember.licensePlate,
          cccdImages: editingMember.cccdImages,
          isRepresentative: editingMember.isRepresentative,
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          licensePlate: '',
          cccdImages: {
            front: { url: '', publicId: '' },
            back: { url: '', publicId: '' },
          },
          isRepresentative: false,
        });
      }
    }
  }, [editingMember, open]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thành viên');
      return;
    }

    if (!formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    onAddMember({ ...formData, userId: editingMember?.userId || '' });
    onOpenChange(false);

    // Reset form
    const initialFormData: Omit<Member, 'userId'> = {
      name: '',
      phone: '',
      licensePlate: '',
      cccdImages: {
        front: { url: '', publicId: '' },
        back: { url: '', publicId: '' },
      },
      isRepresentative: false,
    };
    setFormData(initialFormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none rounded-none sm:h-auto sm:max-w-2xl sm:rounded-lg flex flex-col max-h-screen">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Họ và tên *
              </Label>
              <Input
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Số điện thoại *
              </Label>
              <Input
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Biển số xe
              </Label>
              <Input
                placeholder="Nhập biển số xe (nếu có)"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRepresentative"
                  checked={formData.isRepresentative}
                  onChange={(e) => setFormData({ ...formData, isRepresentative: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  aria-label="Là người đại diện"
                />
                <Label htmlFor="isRepresentative" className="text-sm font-medium text-slate-700">
                  Là người đại diện
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <IdCard className="w-4 h-4" />
              Ảnh CCCD
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-600">Mặt trước</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  {formData.cccdImages.front.url ? (
                    <div className="space-y-2">
                      <img
                        src={formData.cccdImages.front.url}
                        alt="CCCD mặt trước"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            cccdImages: {
                              ...formData.cccdImages,
                              front: { url: '', publicId: '' },
                            },
                          })
                        }
                      >
                        Xóa ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({
                                ...formData,
                                cccdImages: {
                                  ...formData.cccdImages,
                                  front: { url: reader.result as string, publicId: '' },
                                },
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="frontImageInput"
                        aria-label="Tải ảnh CCCD mặt trước"
                      />
                      <IdCard className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-sm text-slate-500">Nhấn để tải ảnh mặt trước</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById('frontImageInput')?.click()}
                      >
                        Chọn ảnh
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-600">Mặt sau</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  {formData.cccdImages.back.url ? (
                    <div className="space-y-2">
                      <img
                        src={formData.cccdImages.back.url}
                        alt="CCCD mặt sau"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            cccdImages: {
                              ...formData.cccdImages,
                              back: { url: '', publicId: '' },
                            },
                          })
                        }
                      >
                        Xóa ảnh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({
                                ...formData,
                                cccdImages: {
                                  ...formData.cccdImages,
                                  back: { url: reader.result as string, publicId: '' },
                                },
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="backImageInput"
                        aria-label="Tải ảnh CCCD mặt sau"
                      />
                      <IdCard className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-sm text-slate-500">Nhấn để tải ảnh mặt sau</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById('backImageInput')?.click()}
                      >
                        Chọn ảnh
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-slate-200 shrink-0">
          <Button
            variant="outline"
            className="flex-1 text-slate-700 border-slate-300 bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
            onClick={handleSubmit}
          >
            {editingMember ? 'Cập nhật' : 'Thêm thành viên'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
