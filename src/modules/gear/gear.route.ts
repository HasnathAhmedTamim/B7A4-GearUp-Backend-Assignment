import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { gearController } from "./gear.controller";
import { createGearValidationSchema, updateGearValidationSchema } from "./gear.validation";

const router = Router();

router.post(
  "/",
  auth(Role.PROVIDER),
  validateRequest(createGearValidationSchema),
  gearController.createGear,
);

router.get("/", gearController.getAllGear);
router.get("/provider/my-gear", auth(Role.PROVIDER), gearController.getMyGear);

router.get("/:id", gearController.getSingleGear);

router.patch(
  "/:id",
  auth(Role.PROVIDER),
  validateRequest(updateGearValidationSchema),
  gearController.updateGear,
);

router.delete("/:id", auth(Role.PROVIDER), gearController.deleteGear);

export const gearRoutes = router;
