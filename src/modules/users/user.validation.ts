import { Role } from "../../../generated/prisma/enums";
import { z } from "zod";

export const registerUserValidationSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(255),

  email: z.string().trim().email("Invalid email address").toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),

  role: z.enum(Role).optional().default(Role.CUSTOMER),

  photo: z.string().url("Photo must be a valid URL").optional(),

  phone: z.string().max(20).optional(),

  address: z.string().optional(),

  bio: z.string().optional(),
});
