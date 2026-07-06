import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./user.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  const { name, email, password, role, photo, phone, address, bio } = payload;

  // Check existing user
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
   throw new AppError(
     httpStatus.BAD_REQUEST,
     "User already exists with this email.",
   );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcryptSaltRounds),
  );

  // Transaction
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        ...(role ? { role } : {}),
      },
    });

    await tx.profile.create({
      data: {
        userId: createdUser.id,

        ...(photo ? { photo } : {}),
        ...(phone ? { phone } : {}),
        ...(address ? { address } : {}),
        ...(bio ? { bio } : {}),
      },
    });

    const userWithProfile = await tx.user.findUniqueOrThrow({
      where: {
        id: createdUser.id,
      },

      omit: {
        password: true,
      },

      include: {
        profile: true,
      },
    });

    return userWithProfile;
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
};
