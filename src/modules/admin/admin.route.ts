import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";

import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);

router.get("/rentals", auth(Role.ADMIN), adminController.getAllRentals);

router.get("/gear", auth(Role.ADMIN), adminController.getAllGear);
router.get("/stats", auth(Role.ADMIN), adminController.getDashboardStats);

export const adminRoutes = router;