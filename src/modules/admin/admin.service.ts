import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";
import { Role, PaymentStatus } from "../../../generated/prisma/enums";
const getAllUsers = async () => {
  return prisma.user.findMany({
    omit: {
      password: true,
    },

    include: {
      profile: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllRentals = async () => {
  return prisma.rentalOrder.findMany({
    include: {
      customer: {
        omit: {
          password: true,
        },

        include: {
          profile: true,
        },
      },

      gear: {
        include: {
          category: true,
          provider: {
            omit: {
              password: true,
            },
          },
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllGear = async () => {
  return prisma.gear.findMany({
    include: {
      category: true,

      provider: {
        omit: {
          password: true,
        },

        include: {
          profile: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
const updateUserStatus = async (userId: string, status: UserStatus) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      status,
    },

    omit: {
      password: true,
    },

    include: {
      profile: true,
    },
  });
};

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    totalGear,
    totalRentals,
    completedPayments,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: Role.CUSTOMER,
      },
    }),

    prisma.user.count({
      where: {
        role: Role.PROVIDER,
      },
    }),

    prisma.gear.count(),

    prisma.rentalOrder.count(),

    prisma.payment.findMany({
      where: {
        status: PaymentStatus.COMPLETED,
      },

      select: {
        amount: true,
      },
    }),
  ]);

  const totalRevenue = completedPayments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );

  return {
    totalUsers,
    totalCustomers,
    totalProviders,
    totalGear,
    totalRentals,
    totalRevenue,
  };
};

export const adminService = {
  getAllUsers,
  getAllRentals,
  getAllGear,
  updateUserStatus,
  getDashboardStats,
};
