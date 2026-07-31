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

router.get("/admin", auth(Role.ADMIN), dashboardController.getAdminDashboard);
router.get(
  "/admin/recent-rentals",
  auth(Role.ADMIN),
  dashboardController.getRecentRentals,
);
export const dashboardRoutes = router;
