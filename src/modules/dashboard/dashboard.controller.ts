import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { dashboardService } from "./dashboard.service";

const getProviderDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getProviderDashboard(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Provider dashboard data retrieved successfully.",
    data: result,
  });
});

const getAdminDashboard = catchAsync(async (_req: Request, res: Response) => {
  const result = await dashboardService.getAdminDashboard();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin dashboard data retrieved successfully.",
    data: result,
  });
});
const getRecentRentals = catchAsync(async (_req, res) => {
  const result = await dashboardService.getRecentRentals();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Recent rentals retrieved successfully.",
    data: result,
  });
});

export const dashboardController = {
  getProviderDashboard,
  getAdminDashboard,
  getRecentRentals,
};
