import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentService.createCheckoutSession(
      req.user.id,
      req.body.rentalOrderId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully.",
      data: result,
    });
  },
);
const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      return res.status(400).json({
        success: false,
        message: "Stripe signature missing.",
      });
    }

    await paymentService.handleStripeWebhook(signature, req.body as Buffer);

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: "Webhook Error",
    });
  }
};

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
};
