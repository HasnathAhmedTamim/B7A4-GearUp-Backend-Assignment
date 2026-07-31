import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { Role } from "../../generated/prisma/enums";

import config from "../config";
import AppError from "../error/AppError";
import { verifyToken } from "../utils/jwt";

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
        console.log("Cookies:", req.cookies);
        console.log("Access Token:", req.cookies?.accessToken);
    // const authHeader = req.headers.authorization;

    // if (!authHeader) {
    //   return next(
    //     new AppError(httpStatus.UNAUTHORIZED, "You are not authorized."),
    //   );
    // }

    // let token: string;

    // if (authHeader.startsWith("Bearer ")) {
    //   const parts = authHeader.split(" ");

    //   if (parts.length !== 2 || !parts[1]) {
    //     return next(
    //       new AppError(
    //         httpStatus.UNAUTHORIZED,
    //         "Invalid authorization header.",
    //       ),
    //     );
    //   }

    //   token = parts[1];
    // } else {
    //   token = authHeader;
    // }
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;

      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "You are not authorized."),
      );
    }

    // try {
    //   const decoded = verifyToken<TJwtPayload>(token, config.jwtAccessSecret);

    //   req.user = decoded;

    //   if (roles.length > 0 && !roles.includes(decoded.role)) {
    //     return next(
    //       new AppError(
    //         httpStatus.FORBIDDEN,
    //         "You are forbidden to access this resource.",
    //       ),
    //     );
    //   }

    //   next();
    // } catch (error) {
    //   next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token."));
    // }
    try {
      console.log("JWT Secret:", config.jwtAccessSecret);

      const decoded = verifyToken<TJwtPayload>(token, config.jwtAccessSecret);

      console.log("Decoded:", decoded);

      req.user = decoded;

      next();
    } catch (error) {
      console.log("JWT Verify Error:", error);

      next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token."));
    }
  };
