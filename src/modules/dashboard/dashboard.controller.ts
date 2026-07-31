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

export const dashboardController = {
  getProviderDashboard,
};
