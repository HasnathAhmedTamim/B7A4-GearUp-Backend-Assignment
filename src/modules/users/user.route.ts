import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerUserValidationSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerUserValidationSchema),
  userController.registerUser,
);

export const userRoutes = router;
