import express, { Router } from "express";

import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { paymentController } from "./payment.controller";
import { createPaymentValidationSchema } from "./payment.validation";

const router = Router();

router.post(
  "/create",
  auth(Role.CUSTOMER),
  validateRequest(createPaymentValidationSchema),
  paymentController.createCheckoutSession,
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook,
);
export const paymentRoutes = router;
