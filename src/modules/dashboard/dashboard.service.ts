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

const getAdminDashboard = async () => {
  const totalUsers = await prisma.user.count();

  const totalCustomers = await prisma.user.count({
    where: {
      role: "CUSTOMER",
    },
  });

  const totalProviders = await prisma.user.count({
    where: {
      role: "PROVIDER",
    },
  });

  const totalGear = await prisma.gear.count();

  const totalRentals = await prisma.rentalOrder.count();

  const revenue = await prisma.payment.aggregate({
    where: {
      status: "COMPLETED",
    },

    _sum: {
      amount: true,
    },
  });

  return {
    totalUsers,

    totalCustomers,

    totalProviders,

    totalGear,

    totalRentals,

    totalRevenue: revenue._sum.amount || 0,
  };
};
const getRecentRentals = async () => {
  return await prisma.rentalOrder.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      gear: {
        select: {
          title: true,
        },
      },
      payment: {
        select: {
          amount: true,
          status: true,
        },
      },
    },
  });
};

export const dashboardService = {
  getProviderDashboard,
  getAdminDashboard,
  getRecentRentals,
};
