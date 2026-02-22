import { z } from 'zod';

import { UserRole } from '@/constants/appConstants';

const fileOrUrl = z.union([z.string().min(1, 'Vui lòng tải ảnh CCCD'), z.instanceof(File)]);

export const updateTenantSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
  role: z.nativeEnum(UserRole),

  cccdImagesFront: fileOrUrl,
  cccdImagesBack: fileOrUrl,
});
