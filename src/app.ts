import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import config from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { gearRoutes } from "./modules/gear/gear.route";

const app = express();

app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GearUp Backend Running Successfully",
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gear", gearRoutes);






app.use(notFound);

app.use(globalErrorHandler);
export default app;
