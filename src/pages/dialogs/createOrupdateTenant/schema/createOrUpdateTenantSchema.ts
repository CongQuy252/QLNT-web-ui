import { z } from 'zod';

import type { User } from '@/types/user';

export const createOrUpdateTenantSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  CCCD: z
    .string()
    .regex(/^\d{12}$/, 'CCCD phải gồm 12 chữ số')
    .optional(),
  CCCDImage: z.array(z.string()).min(1, 'Vui lòng tải ảnh CCCD'),
});

export type TenantFormValues = Pick<User, 'name' | 'email' | 'phone' | 'CCCD' | 'CCCDImage'>;
