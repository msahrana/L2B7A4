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

const getPropertyReviewsFromDB = async (
    propertyId: string,
    query: Record<string, any>,
) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check property exists
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
        },
    });

    if (!property) {
        throw new Error('Property not found.');
    }

    const [reviewStats, totalReviews, reviews] = await Promise.all([
        prisma.review.aggregate({
            where: {
                propertyId,
            },
            _avg: {
                rating: true,
            },
        }),

        prisma.review.count({
            where: {
                propertyId,
            },
        }),

        prisma.review.findMany({
            where: {
                propertyId,
            },

            skip,
            take: limit,

            orderBy: {
                createdAt: 'desc',
            },

            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                profilePhoto: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total: totalReviews,
            totalPage: Math.ceil(totalReviews / limit),
        },

        data: {
            propertyId,

            averageRating: Number((reviewStats._avg.rating ?? 0).toFixed(1)),

            totalReviews,

            reviews,
        },
    };
};

export const propertyService = {
    getAllPropertiesFromDB,
    getSinglePropertyFromDB,
    getPropertyReviewsFromDB,
};
