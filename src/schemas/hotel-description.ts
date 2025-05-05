import { z } from 'zod';
export const descriptionHotelSchema = z.object({
  recipe: z.object({
    hotelDescription: z.string(),
  }),
});

export type descriptionHotelSchemaResponse = z.infer<typeof descriptionHotelSchema>;
