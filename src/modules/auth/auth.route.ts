import { Router } from "express";

import { validateRequest } from "../../middlewares/validateRequest";

import { authController } from "./auth.controller";
import { loginValidationSchema } from "./auth.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.loginUser,
);

router.get(
  "/me",
  auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  authController.getMe,
);


router.post(
  "/refresh-token",
  authController.refreshToken
);

router.post("/logout", authController.logout);




export const authRoutes = router;
