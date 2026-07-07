import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { rentalService } from "./rental.service";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user.id;

  const result = await rentalService.createRental(customerId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental order created successfully.",
    data: result,
  });
});
const getMyRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getMyRentals(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental history retrieved successfully.",
    data: result,
  });
});

const getSingleRental = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getSingleRental(
    req.params.id as string,
    req.user.id,
    req.user.role,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental retrieved successfully.",
    data: result,
  });
});
const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalService.getProviderOrders(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider orders retrieved successfully.",
    data: result,
  });
});

const updateRentalStatus = catchAsync(async (req, res) => {
  const result = await rentalService.updateRentalStatus(
    req.user.id,
    req.params.id as string,
    req.body.status as RentalStatus,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental status updated successfully.",
    data: result,
  });
});

export const rentalController = {
  createRental,
    getMyRentals,
    getSingleRental,
    getProviderOrders,
    updateRentalStatus,
};
