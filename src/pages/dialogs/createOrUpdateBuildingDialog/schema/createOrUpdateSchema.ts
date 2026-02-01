import { z } from 'zod';

export const buildingSchema = z.object({
  name: z.string().min(1),
  address: z.string(),
  city: z.string(),
  ward: z.string(),
  totalFloors: z.coerce.number().min(1),
  totalRooms: z.coerce.number().min(1),
  yearBuilt: z.coerce.number(),
  phone: z.string(),
  email: z.string().email(),
  description: z.string().optional(),
});

export type BuildingFormInput = z.input<typeof buildingSchema>;
export type BuildingFormOutput = z.output<typeof buildingSchema>;
