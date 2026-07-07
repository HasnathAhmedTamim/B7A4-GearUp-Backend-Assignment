import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { categoryController } from "./category.controller";
import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} from "./category.validation";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(createCategoryValidationSchema),
  categoryController.createCategory,
);

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getSingleCategory);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  validateRequest(updateCategoryValidationSchema),
  categoryController.updateCategory,
);

router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoutes = router;
