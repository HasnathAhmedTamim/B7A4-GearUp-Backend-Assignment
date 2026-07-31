import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser, IUpdateProfile } from "./user.interface";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/client";

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
const updateProfile = async (userId: string, payload: IUpdateProfile) => {
  const { name, photo, phone, address, bio } = payload;

  const result = await prisma.$transaction(async (tx) => {
    // Update User table
    if (name) {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
        },
      });
    }

    // Update Profile table
    await tx.profile.upsert({
      where: {
        userId,
      },

      update: {
        ...(photo !== undefined && {
          photo,
        }),

        ...(phone !== undefined && {
          phone,
        }),

        ...(address !== undefined && {
          address,
        }),

        ...(bio !== undefined && {
          bio,
        }),
      },

      create: {
        userId,

        ...(photo !== undefined && {
          photo,
        }),

        ...(phone !== undefined && {
          phone,
        }),

        ...(address !== undefined && {
          address,
        }),

        ...(bio !== undefined && {
          bio,
        }),
      },

      include: {
        user: true,
      },
    });

    return tx.user.findUniqueOrThrow({
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
  });

  return result;
};

const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "SUSPENDED",
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === Role.ADMIN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Admin account cannot be blocked",
    );
  }

  const result = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      status,
    },

    omit: {
      password: true,
    },
  });

  return result;
};
export const userService = {
  registerUserIntoDB,
  updateProfile,
  updateUserStatus,
};
