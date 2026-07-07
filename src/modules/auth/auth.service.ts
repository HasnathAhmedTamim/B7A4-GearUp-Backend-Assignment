import bcrypt from "bcryptjs";
import httpStatus from "http-status";




import { prisma } from "../../lib/prisma";

import { ILoginUser } from "./auth.interface";
import AppError from "../../error/AppError";

import config from "../../config";
import { verifyToken, createToken } from "../../utils/jwt";
import { StringValue } from "ms";

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

const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },

    omit: {
      password: true,
    },

    include: {
      profile: true,
    },
  });

  return user;
};

const refreshToken = async (token: string) => {
  const decoded = verifyToken<{
    id: string;
    email: string;
    role: string;
  }>(token, config.jwtRefreshSecret);

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: decoded.id,
    },
  });

  if (user.status === "SUSPENDED") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account has been suspended.",
    );
  }

  const accessToken = createToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn as StringValue,
  );

  return accessToken;
};

export const authService = {
  loginUser,
  getMe,
  refreshToken,
};
