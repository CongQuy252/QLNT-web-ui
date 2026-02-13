import { useForm } from 'react-hook-form';

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
import {
  type TenantFormValues,
  createOrUpdateTenantSchema,
} from '@/pages/dialogs/createOrupdateTenant/schema/createOrUpdateTenantSchema';
import type { User } from '@/types/user';

interface CreateOrUpdateTenantProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: User;
}

const CreateOrUpdateTenant: React.FC<CreateOrUpdateTenantProps> = ({ isOpen, onClose, tenant }) => {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(createOrUpdateTenantSchema),
    defaultValues: {
      fullName: tenant?.fullName ?? '',
      email: tenant?.email ?? '',
      username: tenant?.username ?? '',
      phone: tenant?.phone ?? '',
      CCCD: tenant?.CCCD ?? '',
      CCCDImage: tenant?.CCCDImage ?? [],
    },
  });

  const onSubmit = (values: TenantFormValues) => {
    const payload: Partial<User> = {
      ...values,
      role: 'tenant',
    };

    console.log(payload);
    onClose();
    form.reset();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tenant ? 'Cập nhật người thuê' : 'Thêm người thuê mới'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4 max-h-96 overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="fullName"
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
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="tenant01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0901234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="CCCD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số CCCD</FormLabel>
                  <FormControl>
                    <Input placeholder="012345678901" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="CCCDImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh CCCD</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        const urls = files.map((file) => URL.createObjectURL(file));
                        field.onChange(urls);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
