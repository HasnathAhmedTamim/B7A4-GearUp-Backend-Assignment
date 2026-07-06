import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import config from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

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









app.use(notFound);

app.use(globalErrorHandler);
export default app;
