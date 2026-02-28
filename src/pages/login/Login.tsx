import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { useLoginMutation } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type LoginFormData, loginSchema } from '@/pages/login/useLoginConstants';

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);

    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/');
      },

      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          setErrorMessage(
            error.status === 401
              ? 'Email hoặc mật khẩu không đúng'
              : 'Đã xảy ra lỗi khi đăng nhập, vui lòng thử lại',
          );
        }
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-90 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Đăng nhập</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span>Đăng nhập</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
