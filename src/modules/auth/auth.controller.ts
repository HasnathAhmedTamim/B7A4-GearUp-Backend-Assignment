import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
};

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  res.cookie("accessToken", result.accessToken, cookieOptions);
  res.cookie("refreshToken", result.refreshToken, cookieOptions);;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: result.user,
  });
});

// const getMe = catchAsync(async (req, res) => {
//   const result = await authService.getMe(req.user.id);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Profile retrieved successfully",
//     data: result,
//   });
// });
const getMe = catchAsync(async (req: Request, res: Response) => {
  console.log("REQ USER:", req.user);

  const result = await authService.getMe(req.user.id);

  console.log("DB USER:", result);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;

  const accessToken = await authService.refreshToken(token);

  res.cookie("accessToken", accessToken, cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token generated successfully",
    data: {
      accessToken,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logout successful",
    data: null,
  });
});

export const authController = {
  loginUser,
  getMe,
  refreshToken,
  logout,
};
