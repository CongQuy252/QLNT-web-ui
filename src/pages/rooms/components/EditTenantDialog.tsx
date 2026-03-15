import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useUserQuery } from '@/api/user';
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
import { useLoading } from '@/hooks/useLoading';
import { FileUploadField } from '@/pages/dialogs/createOrupdateTenant/FileUploadField';
import { updateTenantSchema } from '@/pages/dialogs/createOrupdateTenant/schema/createOrUpdateTenantSchema';
import type { UpdateTenantRequest } from '@/types/user';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  onSubmit?: (data: UpdateTenantRequest) => void;
  loading?: boolean;
};

const EditTenantDialog = ({ open, onOpenChange, userId, onSubmit, loading }: Props) => {
  const userQuery = useUserQuery(userId, !!userId);
  const { show, hide } = useLoading();

  const form = useForm<UpdateTenantRequest>({
    resolver: zodResolver(updateTenantSchema),
  });

  useEffect(() => {
    if (userQuery.data) {
      const user = userQuery.data;

      form.reset({
        ...user,
        cccdImagesFront: user.cccdImages?.front?.url ?? '',
        cccdImagesBack: user.cccdImages?.back?.url ?? '',
      });
    }
  }, [userQuery.data, form]);

  useEffect(() => {
    if (userQuery.isLoading) show();
    else hide();
  }, [hide, show, userQuery.isLoading]);

  const handleSubmit = (values: UpdateTenantRequest) => {
    if (!onSubmit) return;

    onSubmit(values);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none rounded-none flex flex-col sm:h-auto sm:max-w-lg sm:rounded-lg">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle>Chỉnh sửa người thuê</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-y-auto space-y-2 p-4"
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

            <div className="flex gap-2 pt-4 border-t justify-between">
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
            </div>
            <div className="flex gap-2 pt-4 border-t justify-between">
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
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>

              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTenantDialog;
