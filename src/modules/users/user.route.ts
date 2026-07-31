import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerUserValidationSchema } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/register",
  validateRequest(registerUserValidationSchema),
  userController.registerUser,
);
router.patch(
  "/profile",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  userController.updateProfile,
);

export const userRoutes = router;
