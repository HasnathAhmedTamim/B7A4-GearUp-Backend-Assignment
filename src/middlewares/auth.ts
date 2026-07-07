import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import config from "../config";
import AppError from "../error/AppError";
import { verifyToken } from "../utils/jwt";

import { Role } from "../../generated/prisma/enums";

export type TJwtPayload = {
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
};

declare global {
  namespace Express {
    interface Request {
      user: TJwtPayload;
    }
  }
}

export const auth =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "You are not authorized."),
      );
    }

    try {
      const decoded = verifyToken<TJwtPayload>(token, config.jwtAccessSecret);

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return next(
          new AppError(
            httpStatus.FORBIDDEN,
            "You are forbidden to access this resource.",
          ),
        );
      }

      next();
    } catch {
      next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token."));
    }
  };
