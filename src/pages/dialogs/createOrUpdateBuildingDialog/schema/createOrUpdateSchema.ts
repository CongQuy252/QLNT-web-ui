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
  defaultRoomPrice: z.coerce.number().min(0, { error: 'Giá phòng phải lớn hơn hoặc bằng 0' }).optional(),
  defaultElectricityUnitPrice: z.coerce.number().min(0, { error: 'Giá điện phải lớn hơn hoặc bằng 0' }).optional(),
  defaultWaterUnitPrice: z.coerce.number().min(0, { error: 'Giá nước phải lớn hơn hoặc bằng 0' }).optional(),
  defaultInternetFee: z.coerce.number().min(0, { error: 'Phí internet phải lớn hơn hoặc bằng 0' }).optional(),
  defaultParkingFee: z.coerce.number().min(0, { error: 'Phí gửi xe phải lớn hơn hoặc bằng 0' }).optional(),
  defaultServiceFee: z.coerce.number().min(0, { error: 'Phí dịch vụ phải lớn hơn hoặc bằng 0' }).optional(),
  defaultArea: z.coerce.number().min(0, { error: 'Diện tích phải lớn hơn 0' }).optional(),
});

export type BuildingFormInput = z.input<typeof buildingSchema>;
export type BuildingFormOutput = z.output<typeof buildingSchema>;
