import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: unknown = err;

  // Custom App Error
  if ("statusCode" in err && "message" in err) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Zod Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";

    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Prisma Unique Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 400;
      message = "Duplicate value found";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
