import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/constants/appConstants';
import { FileUploadField } from '@/pages/dialogs/createOrupdateTenant/FileUploadField';
import { updateTenantSchema } from '@/pages/dialogs/createOrupdateTenant/schema/createOrUpdateTenantSchema';
import type { UpdateTenantRequest } from '@/types/user';

interface CreateOrUpdateTenantProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: UpdateTenantRequest;
}

const CreateOrUpdateTenant: React.FC<CreateOrUpdateTenantProps> = ({ isOpen, onClose, tenant }) => {
  const form = useForm<UpdateTenantRequest>({
    resolver: zodResolver(updateTenantSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.tenant,
      phone: '',
      cccdImagesFront: '',
      cccdImagesBack: '',
    },
  });

  // 🔥 cập nhật dữ liệu khi edit
  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        role: tenant.role,
        cccdImagesFront: tenant.cccdImagesFront ?? '',
        cccdImagesBack: tenant.cccdImagesBack ?? '',
      });
    }
  }, [tenant, form]);

  const onSubmit: SubmitHandler<UpdateTenantRequest> = (values) => {
    console.log(values);

    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-screen h-screen max-w-none rounded-none p-0 flex flex-col">
        <div className={'flex items-center justify-between h-14 px-4 border-b'}>
          <DialogHeader className={'p-0'}>
            <DialogTitle>{tenant ? 'Cập nhật người thuê' : 'Thêm người thuê mới'}</DialogTitle>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4 h-full top-0 overflow-y-auto p-6"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0901234567" {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <FormControl>
                    <select {...field} className="border rounded px-3 py-2 w-full">
                      <option value={UserRole.tenant}>Tenant</option>
                      <option value={UserRole.admin}>Admin</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CCCD FRONT */}
            <FormField
              control={form.control}
              name="cccdImagesFront"
              render={({ field }) => <FileUploadField label="Ảnh CCCD mặt trước" field={field} />}
            />

            {/* CCCD BACK */}
            <FormField
              control={form.control}
              name="cccdImagesBack"
              render={({ field }) => <FileUploadField label="Ảnh CCCD mặt sau" field={field} />}
            />
            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" className="flex-1">
                {tenant ? 'Cập nhật' : 'Thêm người thuê'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrUpdateTenant;
