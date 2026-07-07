import { z } from "zod";

export const createCategoryValidationSchema = z.object({
  name: z.string().trim().min(2, "Category name is required").max(100),

  description: z.string().trim().optional(),
});

export const updateCategoryValidationSchema =
  createCategoryValidationSchema.partial();
