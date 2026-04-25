import { Car, IdCard, Phone, User } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Member } from '@/types/room';

const memberSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên thành viên'),
  phone: z.string().regex(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số'),
  licensePlate: z.string().optional(),
  isRepresentative: z.boolean(),
  cccdImages: z.object({
    front: z.object({
      url: z.string(),
      publicId: z.string(),
    }),
    back: z.object({
      url: z.string(),
      publicId: z.string(),
    }),
  }),
});
type FormValues = z.infer<typeof memberSchema>;
interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: Member) => void;
  editingMember?: Member | null;
}

const defaultRoomValues = {
  name: '',
  phone: '',
  licensePlate: '',
  isRepresentative: false,
  cccdImages: {
    front: { url: '', publicId: '' },
    back: { url: '', publicId: '' },
  },
};

const AddMemberDialog = ({
  open,
  onOpenChange,
  onAddMember,
  editingMember,
}: AddMemberDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: defaultRoomValues,
  });

  useEffect(() => {
    if (open) {
      if (editingMember) {
        reset({
          name: editingMember.name,
          phone: editingMember.phone,
          licensePlate: editingMember.licensePlate ?? '',
          isRepresentative: editingMember.isRepresentative,
          cccdImages: editingMember.cccdImages,
        });
      } else {
        reset(defaultRoomValues);
      }
    }
  }, [editingMember, open, reset]);

  const onSubmit = (data: FormValues) => {
    onAddMember({
      ...data,
      userId: editingMember?.userId || '',
    });
    onOpenChange(false);
    reset();
  };

  const handleImageUpload = (file: File, type: 'front' | 'back') => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setValue(`cccdImages.${type}.url`, reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const formatPlate = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (cleaned.length <= 4) {
      return cleaned;
    }

    return cleaned.slice(0, 4) + '―' + cleaned.slice(4);
  };

  const cccdImages = watch('cccdImages');
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
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    isRequired
                  >
                    <User className="w-4 h-4" />
                    Họ và tên
                  </Label>
                  <Input placeholder="Nhập họ và tên" {...field} />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label
                    className="text-sm font-medium text-slate-700 flex items-center gap-2"
                    isRequired
                  >
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </Label>
                  <Input
                    placeholder="Nhập số điện thoại"
                    {...field}
                    maxLength={10}
                    numericOnly={true}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
              )}
            />
            <Controller
              control={control}
              name="licensePlate"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Biển số xe
                  </Label>
                  <Input
                    placeholder="Nhập biển số xe (nếu có)"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPlate(e.target.value);
                      field.onChange(formatted);
                    }}
                    maxLength={10}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="isRepresentative"
              render={({ field }) => (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isRepresentative"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      aria-label="Là người đại diện"
                    />
                    <Label
                      htmlFor="isRepresentative"
                      className="text-sm font-medium text-slate-700"
                    >
                      Là người đại diện
                    </Label>
                  </div>
                </div>
              )}
            />
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
                  {cccdImages.front.url ? (
                    <div className="space-y-2">
                      <img
                        src={cccdImages.front.url}
                        alt="CCCD mặt trước"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setValue('cccdImages.front.url', '')}
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
                            handleImageUpload(file, 'front');
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
                  {cccdImages.back.url ? (
                    <div className="space-y-2">
                      <img
                        src={cccdImages.back.url}
                        alt="CCCD mặt sau"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setValue('cccdImages.back.url', '')}
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
                            handleImageUpload(file, 'back');
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
            onClick={handleSubmit(onSubmit)}
          >
            {editingMember ? 'Cập nhật' : 'Thêm thành viên'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
