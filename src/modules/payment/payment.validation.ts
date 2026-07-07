import { z } from "zod";

export const createPaymentValidationSchema = z.object({
  rentalOrderId: z.string().uuid(),
});
