import { Role } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ICreateProperty } from './landlord.interface';

const createPropertyIntoDB = async (
    payload: ICreateProperty,
    landlordId: string,
) => {
    // Check landlord
    const landlord = await prisma.user.findUnique({
        where: {
            id: landlordId,
        },
    });

    if (!landlord) {
        throw new Error('Landlord not found.');
    }

    if (landlord.role !== Role.LANDLORD) {
        throw new Error('Only landlords can create properties.');
    }

    // Check category
    const category = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });

    if (!category) {
        throw new Error('Category not found.');
    }

    const result = await prisma.property.create({
        data: {
            title: payload.title,
            description: payload.description,
            location: payload.location,
            address: payload.address,
            rent: Number(payload.rent),
            bedrooms: Number(payload.bedrooms),
            bathrooms: Number(payload.bathrooms),
            area: payload.area ? Number(payload.area) : null,
            propertyType: payload.propertyType,
            amenities: payload.amenities,
            thumbnail: payload.thumbnail,
            images: payload.images,
            landlordId,
            categoryId: payload.categoryId,
        },
        include: {
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            category: true,
        },
    });

    return result;
};

const getAllPropertiesIntoDB = async (landlordId: string) => {
    return prisma.property.findMany({
        include: {
            landlord: true,
            category: true,
        },
    });
};

const getAllRentalRequestsFromDB = async (landlordId: string) => {
    const landlord = await prisma.user.findUnique({
        where: {
            id: landlordId,
        },
    });

    if (!landlord) {
        throw new Error('Landlord not found.');
    }

    const requests = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId,
            },
        },
        include: {
            tenant: {
                include: {
                    profile: true,
                },
            },
            property: {
                include: {
                    category: true,
                },
            },
            payment: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return requests;
};

const getSinglePropertyIntoDB = async (id: string) => {
    const property = await prisma.property.findUnique({
        where: {
            id,
        },
        include: {
            landlord: true,
            category: true,
            reviews: true,
        },
    });

    if (!property) {
        throw new Error('Property not found.');
    }

    return property;
};

const updatePropertyIntoDB = async (
    id: string,
    payload: any,
    landlordId: string,
) => {
    const property = await prisma.property.findUnique({
        where: {
            id,
        },
    });

    if (!property) {
        throw new Error('Property not found.');
    }

    if (property.landlordId !== landlordId) {
        throw new Error('Unauthorized');
    }

    return prisma.property.update({
        where: {
            id,
        },
        data: payload,
    });
};

const deletePropertyIntoDB = async (id: string, landlordId: string) => {
    const property = await prisma.property.findUnique({
        where: {
            id,
        },
    });

    if (!property) {
        throw new Error('Property not found.');
    }

    if (property.landlordId !== landlordId) {
        throw new Error('Unauthorized');
    }

    return prisma.property.delete({
        where: {
            id,
        },
    });
};

export const landlordService = {
    createPropertyIntoDB,
    getAllPropertiesIntoDB,
    getAllRentalRequestsFromDB,
    getSinglePropertyIntoDB,
    updatePropertyIntoDB,
    deletePropertyIntoDB,
};
