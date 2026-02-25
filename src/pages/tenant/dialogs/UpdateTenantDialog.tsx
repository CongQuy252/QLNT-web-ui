import { useEffect } from 'react';
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
import { UserRole } from '@/constants/appConstants';
import { FileUploadField } from '@/pages/dialogs/createOrupdateTenant/FileUploadField';
import { updateTenantSchema } from '@/pages/dialogs/createOrupdateTenant/schema/createOrUpdateTenantSchema';
import type { UpdateTenantRequest } from '@/types/user';

interface UpdateTenantDialogProps {
  isOpen: boolean;
  tenant: UpdateTenantRequest;
  onClose: () => void;
  onSubmit: (data: UpdateTenantRequest) => void;
}

const UpdateTenantDialog: React.FC<UpdateTenantDialogProps> = ({
  isOpen,
  tenant,
  onClose,
  onSubmit,
}) => {
  const form = useForm<UpdateTenantRequest>({
    resolver: zodResolver(updateTenantSchema),
    defaultValues: tenant,
  });

  useEffect(() => {
    form.reset(tenant);
  }, [tenant, form]);

  const handleSubmit = (values: UpdateTenantRequest) => {
    onSubmit(values);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-screen h-screen max-w-none rounded-none flex flex-col">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>Cập nhật người thuê</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-y-auto space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="email" {...field} />
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
                    <Input {...field} inputMode="numeric" type="tel" maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cccd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số CCCD</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={13} placeholder="CCCD" />
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

            <FormField
              control={form.control}
              name="cccdImagesFront"
              render={({ field }) => <FileUploadField label="CCCD mặt trước" field={field} />}
            />

            <FormField
              control={form.control}
              name="cccdImagesBack"
              render={({ field }) => <FileUploadField label="CCCD mặt sau" field={field} />}
            />

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" className="flex-1">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTenantDialog;
