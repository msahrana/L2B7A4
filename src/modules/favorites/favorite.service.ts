import { prisma } from '../../lib/prisma';
import { ICreateFavorite } from './favorite.interface';

const createFavoriteIntoDB = async (
    userId: string,
    payload: ICreateFavorite,
) => {
    const property = await prisma.property.findUnique({
        where: {
            id: payload.propertyId,
        },
    });

    if (!property) {
        throw new Error('Property not found.');
    }

    const exists = await prisma.favorite.findUnique({
        where: {
            userId_propertyId: {
                userId,
                propertyId: payload.propertyId,
            },
        },
    });

    if (exists) {
        throw new Error('Property already exists in favorites.');
    }

    const result = await prisma.favorite.create({
        data: {
            userId,
            propertyId: payload.propertyId,
        },

        include: {
            property: {
                include: {
                    category: true,
                    landlord: {
                        omit: {
                            password: true,
                        },
                        include: {
                            profile: true,
                        },
                    },
                },
            },
        },
    });

    return result;
};

const getMyFavoritesFromDB = async (userId: string) => {
    const result = await prisma.favorite.findMany({
        where: {
            userId,
        },

        orderBy: {
            createdAt: 'desc',
        },

        include: {
            property: {
                include: {
                    category: true,
                    landlord: {
                        omit: {
                            password: true,
                        },
                        include: {
                            profile: true,
                        },
                    },
                },
            },
        },
    });

    return result;
};

const deleteFavoriteFromDB = async (userId: string, propertyId: string) => {
    const favorite = await prisma.favorite.findUnique({
        where: {
            userId_propertyId: {
                userId,
                propertyId,
            },
        },
    });

    if (!favorite) {
        throw new Error('Favorite property not found.');
    }

    await prisma.favorite.delete({
        where: {
            userId_propertyId: {
                userId,
                propertyId,
            },
        },
    });

    return {
        propertyId,
    };
};

export const favoriteService = {
    createFavoriteIntoDB,
    getMyFavoritesFromDB,
    deleteFavoriteFromDB,
};
