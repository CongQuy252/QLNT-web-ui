import { z } from 'zod';

const currentYear = new Date().getFullYear();
export const buildingSchema = z.object({
  name: z.string().min(1, { error: 'Tên tòa nhà không được để trống' }),
  address: z.string().min(1, { error: 'Địa chỉ không được để trống' }),
  city: z.string().min(1, { error: 'Thành phố không được để trống' }),
  district: z.string().min(1, { error: 'Phường/xã không được để trống' }),
  totalFloors: z.coerce.number().min(1, { error: 'Số tầng phải lớn hơn 0' }),
  totalRooms: z.coerce.number().min(1, { error: 'Số phòng phải lớn hơn 0' }),
  yearBuilt: z
    .union([z.coerce.number().min(1900).max(currentYear), z.literal(''), z.undefined()])
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  description: z.string().optional(),
});

export type BuildingFormInput = z.input<typeof buildingSchema>;
export type BuildingFormOutput = z.output<typeof buildingSchema>;
