import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { gearService } from "./gear.service";

const createGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user.id;

  const result = await gearService.createGear(providerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear created successfully.",
    data: result,
  });
});
const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await gearService.getAllGear(
    req.query as Record<string, unknown>,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear retrieved successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleGear = catchAsync(async (req, res) => {
  const result = await gearService.getSingleGear(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear retrieved successfully.",
    data: result,
  });
});

const updateGear = catchAsync(async (req, res) => {
  const result = await gearService.updateGear(
    req.user.id,
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear updated successfully.",
    data: result,
  });
});

const deleteGear = catchAsync(async (req, res) => {
  await gearService.deleteGear(req.user.id, req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear deleted successfully.",
    data: null,
  });
});

const getMyGear = catchAsync(async (req, res) => {
  const result = await gearService.getMyGear(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My gear retrieved successfully.",
    data: result,
  });
});

export const gearController = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
  getMyGear,
};
