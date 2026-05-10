import { queryClient } from '@/lib/reactQuery';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { useCreateUserMutation } from '@/api/user';
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
import { QueriesKey, UserRole } from '@/constants/appConstants';
import { useLoading } from '@/hooks/useLoading';
import type { UpdateTenantRequest } from '@/types/user';

interface CreateUserProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: UpdateTenantRequest;
}

enum TenantFormField {
  name = 'name',
  email = 'email',
  phone = 'phone',
  role = 'role',
}

interface CreateUserRequest {
  email: string;
  name: string;
  role: UserRole;
  phone: string;
}

const createUserSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
  role: z.nativeEnum(UserRole),
});

const CreateUser: React.FC<CreateUserProps> = ({ isOpen, onClose, tenant }) => {
  const createUserMutation = useCreateUserMutation();
  const { hide, show } = useLoading();

  const form = useForm<CreateUserRequest>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: UserRole.noRole,
      phone: '',
    },
  });

  useEffect(() => {
    form.reset({
      name: '',
      email: '',
      phone: '',
      role: UserRole.noRole,
    });
  }, [form]);

  const onSubmit: SubmitHandler<CreateUserRequest> = async (values) => {
    show();
    const formData = new FormData();

    formData.append(TenantFormField.name, values.name);
    formData.append(TenantFormField.email, values.email);
    formData.append(TenantFormField.phone, values.phone);
    formData.append(TenantFormField.role, String(values.role));

    await createUserMutation.mutateAsync(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueriesKey.users] });
        hide();
        onClose();
      },
      onSettled: hide,
    });
    queryClient.invalidateQueries({
      queryKey: [QueriesKey.users],
    });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-screen h-screen max-w-none rounded-none p-0 flex flex-col sm:w-full sm:max-w-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-xl">
        <div className={'flex items-center justify-between h-14 px-4 border-b'}>
          <DialogHeader className={'p-0'}>
            <DialogTitle>{tenant ? 'Cập nhật người thuê' : 'Thêm người thuê mới'}</DialogTitle>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4 overflow-y-auto p-6"
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
                    <Input placeholder="0901234567" {...field} type="tel" maxLength={10} />
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
                    <select
                      value={String(field.value)}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value={UserRole.noRole}>Không có role</option>
                      <option value={UserRole.admin}>Admin</option>
                      <option value={UserRole.manager}>Quản lý</option>
                    </select>
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

export default CreateUser;
