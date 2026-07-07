import { UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

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

export const adminService = {
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    getAllPropertiesFromDB,
    getAllRentalsFromDB,
};
