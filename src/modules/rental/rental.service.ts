import httpStatus from "http-status";
import { differenceInCalendarDays } from "date-fns";

import AppError from "../../error/AppError";
import { prisma } from "../../lib/prisma";

import { IRental } from "./rental.interface";
import { Role } from "../../../generated/prisma/enums";
import { RentalStatus } from "../../../generated/prisma/enums";
const createRental = async (customerId: string, payload: IRental) => {
  const { gearId, quantity, startDate, endDate } = payload;

  // Date Validation
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date.",
    );
  }

  const totalDays = differenceInCalendarDays(end, start);

  // Find Gear
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  //Provider cannot rent their own gear
  //   if (gear.providerId === customerId) {
  //     throw new AppError(
  //       httpStatus.BAD_REQUEST,
  //       "You cannot rent your own gear.",
  //     );
  //   }

  // Stock Check
  if (gear.stock < quantity) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient stock available.");
  }

  const totalAmount = Number(gear.pricePerDay) * quantity * totalDays;

  return await prisma.$transaction(async (tx) => {
    const rental = await tx.rentalOrder.create({
      data: {
        customerId,
        gearId,

        startDate: start,
        endDate: end,

        quantity,

        totalAmount,
      },

      include: {
        gear: true,
      },
    });

    const remainingStock = gear.stock - quantity;

    await tx.gear.update({
      where: {
        id: gear.id,
      },

      data: {
        stock: remainingStock,

        availability: remainingStock > 0,
      },
    });

    return rental;
  });
};
const getMyRentals = async (customerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },

    include: {
      gear: {
        include: {
          category: true,
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const getSingleRental = async (
  rentalId: string,
  userId: string,
  role: Role,
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: rentalId,
    },

    include: {
      gear: {
        include: {
          category: true,
          provider: {
            omit: {
              password: true,
            },
            include: {
              profile: true,
            },
          },
        },
      },

      customer: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },

      payment: true,
    },
  });

  if (role !== Role.ADMIN && rental.customerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to view this rental.",
    );
  }

  return rental;
};

const getProviderOrders = async (providerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      gear: {
        providerId,
      },
    },

    include: {
      customer: {
        omit: {
          password: true,
        },

        include: {
          profile: true,
        },
      },

      gear: {
        include: {
          category: true,
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const updateRentalStatus = async (
  providerId: string,
  rentalId: string,
  status: RentalStatus,
) => {
  const rental = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: rentalId,
    },
    include: {
      gear: true,
    },
  });

  if (rental.gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this rental.",
    );
  }

  // Business Rules
  if (
    rental.status === RentalStatus.PLACED &&
    status !== RentalStatus.CONFIRMED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order must be confirmed first.",
    );
  }

  if (
    rental.status === RentalStatus.PAID &&
    status !== RentalStatus.PICKED_UP
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Order must be picked up after payment.",
    );
  }

  if (
    rental.status === RentalStatus.PICKED_UP &&
    status !== RentalStatus.RETURNED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order must be returned.");
  }

  if (rental.status === RentalStatus.CONFIRMED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Waiting for payment confirmation.",
    );
  }

  const result = await prisma.rentalOrder.update({
    where: {
      id: rentalId,
    },
    data: {
      status,
    },
    include: {
      gear: true,
      customer: true,
      payment: true,
    },
  });

  return result;
};

export const rentalService = {
  createRental,
  getMyRentals,
  getSingleRental,
  getProviderOrders,
  updateRentalStatus,
};
