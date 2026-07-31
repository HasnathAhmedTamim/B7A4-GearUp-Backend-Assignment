import { prisma } from "../../lib/prisma";

const getProviderDashboard = async (providerId: string) => {
  const totalGear = await prisma.gear.count({
    where: {
      providerId,
    },
  });

  const pendingOrders = await prisma.rentalOrder.count({
    where: {
      gear: {
        providerId,
      },

      status: "PLACED",
    },
  });

  const activeRentals = await prisma.rentalOrder.count({
    where: {
      gear: {
        providerId,
      },

      status: {
        in: ["CONFIRMED", "PAID", "PICKED_UP"],
      },
    },
  });

  const earnings = await prisma.payment.aggregate({
    where: {
      rentalOrder: {
        gear: {
          providerId,
        },
      },

      status: "COMPLETED",
    },

    _sum: {
      amount: true,
    },
  });

  return {
    totalGear,

    pendingOrders,

    activeRentals,

    totalEarnings: earnings._sum.amount || 0,
  };
};

export const dashboardService = {
  getProviderDashboard,
};
