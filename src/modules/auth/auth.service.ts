import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { StringValue } from "ms";


import config from "../../config";
import { prisma } from "../../lib/prisma";
import { createToken } from "../../utils/jwt";

import { ILoginUser } from "./auth.interface";
import AppError from "../../error/AppError";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === "SUSPENDED") {
    throw new AppError(httpStatus.FORBIDDEN, "Your account has been suspended");
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn as StringValue,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwtRefreshSecret,
    config.jwtRefreshExpiresIn as StringValue,
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};
