import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

import { dashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/provider",
  auth(Role.PROVIDER),
  dashboardController.getProviderDashboard,
);

export const dashboardRoutes = router;
