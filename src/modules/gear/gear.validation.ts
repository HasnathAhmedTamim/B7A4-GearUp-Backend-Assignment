import { z } from "zod";

export const createGearValidationSchema = z.object({
  title: z.string().min(2).max(255),

  description: z.string(),

  brand: z.string().min(2).max(100),

  image: z.string().url(),

  pricePerDay: z.coerce.number().positive(),

  stock: z.number().int().min(0),

  availability: z.boolean().optional(),

  categoryId: z.string().uuid(),
});

export const updateGearValidationSchema = createGearValidationSchema.partial();
