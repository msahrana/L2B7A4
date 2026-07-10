import {
    PaymentStatus,
    PropertyStatus,
    RentalRequestStatus,
    Role,
    UserStatus,
} from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { IDashboardStats } from './admin.interface';

const getAllUsersFromDB = async () => {
    return prisma.user.findMany({
        omit: {
            password: true,
        },
        include: {
            profile: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const updateUserStatusIntoDB = async (
    userId: string,
    payload: {
        status: UserStatus;
    },
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error('User not found.');
    }

    return prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: payload.status,
        },
        omit: {
            password: true,
        },
    });
};

const getAllPropertiesFromDB = async () => {
    return prisma.property.findMany({
        include: {
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: true,
            reviews: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const getAllRentalsFromDB = async () => {
    return prisma.rentalRequest.findMany({
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            property: {
                include: {
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    category: true,
                },
            },
            payment: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const getDashboardStatsFromDB = async (): Promise<IDashboardStats> => {
    const [
        totalUsers,
        tenants,
        landlords,
        admins,
        activeUsers,
        bannedUsers,

        totalProperties,
        availableProperties,
        rentedProperties,
        unavailableProperties,

        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        completedRequests,
        cancelledRequests,

        totalPayments,
        pendingPayments,
        completedPayments,
        failedPayments,
        refundedPayments,

        revenue,

        totalReviews,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: {
                role: Role.TENANT,
            },
        }),

        prisma.user.count({
            where: {
                role: Role.LANDLORD,
            },
        }),

        prisma.user.count({
            where: {
                role: Role.ADMIN,
            },
        }),

        prisma.user.count({
            where: {
                status: UserStatus.ACTIVE,
            },
        }),

        prisma.user.count({
            where: {
                status: UserStatus.BANNED,
            },
        }),

        prisma.property.count(),

        prisma.property.count({
            where: {
                status: PropertyStatus.AVAILABLE,
            },
        }),

        prisma.property.count({
            where: {
                status: PropertyStatus.RENTED,
            },
        }),

        prisma.property.count({
            where: {
                status: PropertyStatus.UNAVAILABLE,
            },
        }),

        prisma.rentalRequest.count(),

        prisma.rentalRequest.count({
            where: {
                status: RentalRequestStatus.PENDING,
            },
        }),

        prisma.rentalRequest.count({
            where: {
                status: RentalRequestStatus.APPROVED,
            },
        }),

        prisma.rentalRequest.count({
            where: {
                status: RentalRequestStatus.REJECTED,
            },
        }),

        prisma.rentalRequest.count({
            where: {
                status: RentalRequestStatus.COMPLETED,
            },
        }),

        prisma.rentalRequest.count({
            where: {
                status: RentalRequestStatus.CANCELLED,
            },
        }),

        prisma.payment.count(),

        prisma.payment.count({
            where: {
                status: PaymentStatus.PENDING,
            },
        }),

        prisma.payment.count({
            where: {
                status: PaymentStatus.COMPLETED,
            },
        }),

        prisma.payment.count({
            where: {
                status: PaymentStatus.FAILED,
            },
        }),

        prisma.payment.count({
            where: {
                status: PaymentStatus.REFUNDED,
            },
        }),

        prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: PaymentStatus.COMPLETED,
            },
        }),

        prisma.review.count(),
    ]);

    return {
        users: {
            total: totalUsers,
            tenants,
            landlords,
            admins,
            active: activeUsers,
            banned: bannedUsers,
        },

        properties: {
            total: totalProperties,
            available: availableProperties,
            rented: rentedProperties,
            unavailable: unavailableProperties,
        },

        rentalRequests: {
            total: totalRequests,
            pending: pendingRequests,
            approved: approvedRequests,
            rejected: rejectedRequests,
            completed: completedRequests,
            cancelled: cancelledRequests,
        },

        payments: {
            total: totalPayments,
            pending: pendingPayments,
            completed: completedPayments,
            failed: failedPayments,
            refunded: refundedPayments,
            totalRevenue: revenue._sum.amount ?? 0,
        },

        reviews: {
            total: totalReviews,
        },
    };
};

export const adminService = {
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    getAllPropertiesFromDB,
    getAllRentalsFromDB,
    getDashboardStatsFromDB,
};
