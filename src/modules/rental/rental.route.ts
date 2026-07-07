import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { rentalController } from "./rental.controller";
import { createRentalValidationSchema, updateRentalStatusValidationSchema } from "./rental.validation";

const router = Router();
router.get(
  "/provider/orders",
  auth(Role.PROVIDER),
  rentalController.getProviderOrders,
);

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(createRentalValidationSchema),
  rentalController.createRental,
);
router.get("/", auth(Role.CUSTOMER), rentalController.getMyRentals);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.ADMIN),
  rentalController.getSingleRental,
);

router.patch(
  "/provider/orders/:id",
  auth(Role.PROVIDER),
  validateRequest(updateRentalStatusValidationSchema),
  rentalController.updateRentalStatus,
);


export const rentalRoutes = router;
