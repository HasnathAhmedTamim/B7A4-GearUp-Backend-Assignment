import { z } from "zod";

export const createRentalValidationSchema = z.object({
  gearId: z.string().uuid(),

  startDate: z.string(),

  endDate: z.string(),

  quantity: z.coerce.number().int().positive(),
});

export const updateRentalStatusValidationSchema = z.object({
  status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED"]),
});