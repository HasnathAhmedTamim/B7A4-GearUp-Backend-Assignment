import { z } from "zod";

export const createReviewValidationSchema = z.object({
  gearId: z.string().uuid(),

  rating: z.coerce.number().min(1).max(5),

  comment: z.string().trim().min(5).max(500),
});
