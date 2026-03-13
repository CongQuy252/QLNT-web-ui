import { z } from 'zod';

const roomSchema = z.object({
  number: z.string().min(1, { error: 'Tên phòng không được để trống' }),
  area: z.coerce.number().min(0, { error: 'Diện tích phải lớn hơn 0' }).optional(),
  price: z.coerce.number().min(0, { error: 'Giá thuê phải lớn hơn hoặc bằng 0' }).optional(),
  electricityUnitPrice: z.coerce.number().min(0, { error: 'Giá điện phải lớn hơn hoặc bằng 0' }).optional(),
  waterUnitPrice: z.coerce.number().min(0, { error: 'Giá nước phải lớn hơn hoặc bằng 0' }).optional(),
  waterPricePerPerson: z.coerce.number().min(0, { error: 'Giá nước/người phải lớn hơn hoặc bằng 0' }).optional(),
  waterPricePerCubicMeter: z.coerce.number().min(0, { error: 'Giá nước/m³ phải lớn hơn hoặc bằng 0' }).optional(),
  internetFee: z.coerce.number().min(0, { error: 'Phí internet phải lớn hơn hoặc bằng 0' }).optional(),
  parkingFee: z.coerce.number().min(0, { error: 'Phí gửi xe phải lớn hơn hoặc bằng 0' }).optional(),
  serviceFee: z.coerce.number().min(0, { error: 'Phí dịch vụ phải lớn hơn hoặc bằng 0' }).optional(),
  description: z.string().optional(),
});

export const buildingSchema = z.object({
  name: z.string().min(1, { error: 'Tên tòa nhà không được để trống' }),
  address: z.string().min(1, { error: 'Địa chỉ không được để trống' }),
  city: z.string().min(1, { error: 'Thành phố không được để trống' }),
  district: z.string().min(1, { error: 'Phường/xã không được để trống' }),
  totalRooms: z.coerce.number().min(0, { error: 'Số phòng phải lớn hơn hoặc bằng 0' }).optional(),
  description: z.string().optional(),
  defaultRoomPrice: z.coerce
    .number()
    .min(0, { error: 'Giá phòng phải lớn hơn hoặc bằng 0' })
    .optional(),
  defaultElectricityUnitPrice: z.coerce
    .number()
    .min(0, { error: 'Giá điện phải lớn hơn hoặc bằng 0' })
    .optional(),
  defaultWaterUnitPrice: z.coerce
    .number()
    .min(0, { error: 'Giá nước phải lớn hơn hoặc bằng 0' })
    .optional(),
  waterCalculationType: z.enum(['m3', 'person']).default('m3'),
  defaultInternetFee: z.coerce
    .number()
    .min(0, { error: 'Phí internet phải lớn hơn hoặc bằng 0' })
    .optional(),
  defaultParkingFee: z.coerce
    .number()
    .min(0, { error: 'Phí gửi xe phải lớn hơn hoặc bằng 0' })
    .optional(),
  defaultServiceFee: z.coerce
    .number()
    .min(0, { error: 'Phí dịch vụ phải lớn hơn hoặc bằng 0' })
    .optional(),
  defaultArea: z.coerce.number().min(0, { error: 'Diện tích phải lớn hơn 0' }).optional(),
  rooms: z.array(roomSchema).optional(),
});

export type BuildingFormInput = z.input<typeof buildingSchema>;
export type BuildingFormOutput = z.output<typeof buildingSchema>;
export type RoomInput = z.input<typeof roomSchema>;
