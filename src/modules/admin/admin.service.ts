import { IDashboardStats } from './admin.interface';
import { prisma } from '../../lib/prisma';
import {
    PaymentStatus,
    PropertyStatus,
    RentalRequestStatus,
    Role,
    UserStatus,
} from '../../../generated/prisma/enums';

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

        recentPayments,
        recentRentalRequests,
        topLandlords,
        topProperties,
    ] = await Promise.all([
        // ================= Users =================
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

        // ================= Properties =================
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

        // ================= Rental Requests =================
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

        // ================= Payments =================
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

        // ================= Reviews =================
        prisma.review.count(),

        // ================= Recent Payments =================
        // ================= Recent Payments =================

        prisma.payment.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                rentalRequest: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                title: true,
                                location: true,
                                rent: true,
                            },
                        },
                    },
                },
            },
        }),

        // ================= Recent Rental Requests =================

        prisma.rentalRequest.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                property: {
                    select: {
                        id: true,
                        title: true,
                        rent: true,
                        location: true,
                    },
                },
            },
        }),

        // ================= Top Landlords =================

        prisma.user.findMany({
            where: {
                role: Role.LANDLORD,
            },

            take: 5,

            orderBy: {
                properties: {
                    _count: 'desc',
                },
            },

            select: {
                id: true,
                name: true,
                email: true,

                _count: {
                    select: {
                        properties: true,
                    },
                },
            },
        }),

        // ================= Top Reviewed Properties =================

        prisma.property.findMany({
            take: 5,

            orderBy: {
                reviews: {
                    _count: 'desc',
                },
            },

            select: {
                id: true,
                title: true,
                location: true,
                rent: true,
                thumbnail: true,

                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        }),
    ]);

    return {
        overview: {
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
        },

        recentPayments: recentPayments.map((payment) => ({
            id: payment.id,
            transactionId: payment.transactionId,
            amount: payment.amount,
            method: payment.method,
            provider: payment.provider,
            status: payment.status,
            paidAt: payment.paidAt,
            createdAt: payment.createdAt,

            user: {
                id: payment.user.id,
                name: payment.user.name,
                email: payment.user.email,
            },

            property: payment.rentalRequest.property,
        })),

        recentRentalRequests: recentRentalRequests.map((request) => ({
            id: request.id,
            moveInDate: request.moveInDate,
            status: request.status,
            createdAt: request.createdAt,
            message: request.message,

            tenant: request.tenant,

            property: request.property,
        })),

        topLandlords: topLandlords.map((landlord) => ({
            id: landlord.id,
            name: landlord.name,
            email: landlord.email,
            totalProperties: landlord._count.properties,
        })),

        topProperties: topProperties.map((property) => ({
            id: property.id,
            title: property.title,
            location: property.location,
            rent: property.rent,
            thumbnail: property.thumbnail,
            totalReviews: property._count.reviews,
        })),
    };
};

export const adminService = {
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    getAllPropertiesFromDB,
    getAllRentalsFromDB,
    getDashboardStatsFromDB,
};
