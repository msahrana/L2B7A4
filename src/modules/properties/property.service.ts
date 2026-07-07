import { prisma } from '../../lib/prisma';

const getAllPropertiesFromDB = async (query: any) => {
    const { location, propertyType, categoryId, minPrice, maxPrice } = query;

    const where: any = {
        status: 'AVAILABLE',
    };

    if (location) {
        where.location = {
            contains: location,
            mode: 'insensitive',
        };
    }

    if (propertyType) {
        where.propertyType = propertyType;
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
        where.rent = {};

        if (minPrice) {
            where.rent.gte = Number(minPrice);
        }

        if (maxPrice) {
            where.rent.lte = Number(maxPrice);
        }
    }

    const result = await prisma.property.findMany({
        where,
        include: {
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: true,
            reviews: {
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return result;
};

const getSinglePropertyFromDB = async (id: string) => {
    const property = await prisma.property.findUnique({
        where: {
            id,
        },
        include: {
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: true,
            rentalRequests: true,
            reviews: {
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!property) {
        throw new Error('Property not found.');
    }

    return property;
};

export const propertyService = {
    getAllPropertiesFromDB,
    getSinglePropertyFromDB,
};
