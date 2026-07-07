import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import AppError from "../../error/AppError";
import { ICategory } from "./category.interface";

const createCategory = async (payload: ICategory) => {
  const isExist = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists.");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const getSingleCategory = async (id: string) => {
  return prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return prisma.category.delete({
    where: {
      id,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
