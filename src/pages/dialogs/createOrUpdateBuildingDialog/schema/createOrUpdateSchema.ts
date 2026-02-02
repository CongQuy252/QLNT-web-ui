import { z } from 'zod';

export const buildingSchema = z.object({
  name: z.string().min(1, { error: 'Tên tòa nhà không được để trống' }),
  address: z.string().min(1, { error: 'Địa chỉ không được để trống' }),
  city: z.string().min(1, { error: 'Thành phố không được để trống' }),
  ward: z.string().min(1, { error: 'Phường/xã không được để trống' }),
  totalFloors: z.coerce.number().min(1, { error: 'Số tầng phải lớn hơn 0' }),
  totalRooms: z.coerce.number().min(1, { error: 'Số phòng phải lớn hơn 0' }),
  yearBuilt: z.coerce.number().min(1900, { error: 'Năm xây dựng phải lớn hơn 1900' }),
  description: z.string().optional(),
});

export type BuildingFormInput = z.input<typeof buildingSchema>;
export type BuildingFormOutput = z.output<typeof buildingSchema>;
