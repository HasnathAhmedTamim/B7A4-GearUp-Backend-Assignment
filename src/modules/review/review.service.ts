import httpStatus from "http-status";

import AppError from "../../error/AppError";
import { prisma } from "../../lib/prisma";

import { IReview } from "./review.interface";
const createReview = async (customerId: string, payload: IReview) => {
  const { gearId, rating, comment } = payload;

  // Customer must have returned this gear
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      gearId,
      status: "RETURNED",
    },
  });

  if (!rental) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can review only returned rentals.",
    );
  }

  // One review per gear
  const exists = await prisma.review.findFirst({
    where: {
      customerId,
      gearId,
    },
  });

  if (exists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Review already submitted.");
  }

  return prisma.review.create({
    data: {
      customerId,
      gearId,
      rating,
      comment,
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

      gear: true,
    },
  });
};
const getGearReviews = async (gearId: string) => {
  const result = await prisma.review.findMany({
    where: {
      gearId,
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const reviewService = {
  createReview,
  getGearReviews,
};
