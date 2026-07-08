import Stripe from "stripe";
import httpStatus from "http-status";

import config from "../../config";
import AppError from "../../error/AppError";
import { prisma } from "../../lib/prisma";


import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";

const stripe = new Stripe(config.stripeSecretKey);

const createCheckoutSession = async (
  customerId: string,
  rentalOrderId: string,
) => {
  const rental = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },

    include: {
      gear: true,
      payment: true,
      customer: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental order not found.");
  }

  if (rental.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to pay for this rental.",
    );
  }

  if (rental.status !== "CONFIRMED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental must be confirmed before payment.",
    );
  }

  if (rental.payment) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already exists.");
  }

  const amount = Number(rental.totalAmount);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    success_url: config.stripeSuccessUrl,

    cancel_url: config.stripeCancelUrl,

    customer_email: rental.customer.email,

    metadata: {
      rentalOrderId: rental.id,
    },

    line_items: [
      {
        quantity: 1,

        price_data: {
          currency: "usd",

          unit_amount: Math.round(amount * 100),

          product_data: {
            name: rental.gear.title,
            description: rental.gear.brand,
          },
        },
      },
    ],
  });

  return {
    checkoutUrl: session.url,
  };
};

const handleStripeWebhook = async (signature: string, payload: Buffer) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripeWebhookSecret,
  );

  if (event.type !== "checkout.session.completed") {
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const rentalOrderId = session.metadata?.rentalOrderId;

  if (!rentalOrderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rental metadata missing.");
  }

 await prisma.$transaction(async (tx) => {
   const rental = await tx.rentalOrder.findUniqueOrThrow({
     where: {
       id: rentalOrderId,
     },
   });

   await tx.payment.upsert({
     where: {
       rentalOrderId,
     },

     create: {
       rentalOrderId,

       amount: rental.totalAmount,

       provider: PaymentProvider.STRIPE,

       status: PaymentStatus.COMPLETED,

       transactionId: session.payment_intent
         ? session.payment_intent.toString()
         : null,

       paidAt: new Date(),
     },

     update: {
       status: PaymentStatus.COMPLETED,

       transactionId: session.payment_intent
         ? session.payment_intent.toString()
         : null,

       paidAt: new Date(),
     },
   });

   await tx.rentalOrder.update({
     where: {
       id: rentalOrderId,
     },

     data: {
       status: RentalStatus.PAID,
     },
   });
 });
};
const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId,
      },
    },

    include: {
      rentalOrder: {
        include: {
          gear: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
const getSinglePayment = async (paymentId: string, customerId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },

    include: {
      rentalOrder: {
        include: {
          gear: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found.");
  }

  if (payment.rentalOrder.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are forbidden to access this payment.",
    );
  }

  return payment;
};
export const paymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  getMyPayments,
  getSinglePayment,
};