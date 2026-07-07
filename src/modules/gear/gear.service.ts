import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import AppError from "../../error/AppError";

import { IGear } from "./gear.interface";

const createGear = async (providerId: string, payload: IGear) => {
  // Check Category

  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
  }

  const result = await prisma.gear.create({
    data: {
      title: payload.title,
      description: payload.description,
      brand: payload.brand,
      image: payload.image,

      pricePerDay: payload.pricePerDay,

      stock: payload.stock,

      availability: payload.stock > 0,

      providerId,

      categoryId: payload.categoryId,
    },

    include: {
      category: true,

      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};
const getAllGear = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    categoryId,
    brand,
    availability,
    minPrice,
    maxPrice,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const where: any = {};

  // Search
  if (searchTerm) {
    where.OR = [
      {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  // Category Filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Brand Filter
  if (brand) {
    where.brand = brand;
  }

  // Availability Filter
  if (availability !== undefined) {
    where.availability = availability === "true";
  }

  // Price Filter
  if (minPrice || maxPrice) {
    where.pricePerDay = {};

    if (minPrice) {
      where.pricePerDay.gte = Number(minPrice);
    }

    if (maxPrice) {
      where.pricePerDay.lte = Number(maxPrice);
    }
  }

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const result = await prisma.gear.findMany({
    where,

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

    skip: (currentPage - 1) * currentLimit,

    take: currentLimit,

    orderBy: {
      [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
    },
  });

  const total = await prisma.gear.count({
    where,
  });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit),
    },

    data: result,
  };
};
const getSingleGear = async (id: string) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id,
    },
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
      reviews: true,
    },
  });

  return gear;
};
const updateGear = async (
  providerId: string,
  gearId: string,
  payload: Partial<IGear>,
) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can update only your own gear.",
    );
  }

  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: payload.categoryId,
      },
    });
  }

  const result = await prisma.gear.update({
    where: {
      id: gearId,
    },
    data: {
      ...payload,

      ...(payload.stock !== undefined && {
        availability: payload.stock > 0,
      }),
    },
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};
const deleteGear = async (providerId: string, gearId: string) => {
  const gear = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
    },
  });

  if (gear.providerId !== providerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can delete only your own gear.",
    );
  }

  await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });

  return null;
};
const getMyGear = async (providerId: string) => {
  const result = await prisma.gear.findMany({
    where: {
      providerId,
    },

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

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
export const gearService = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
  getMyGear,
};
