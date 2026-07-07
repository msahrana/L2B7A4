import { prisma } from '../../lib/prisma';
import { ICreateRental } from './rental.interface';

const createRentalIntoDB = async (payload: ICreateRental, tenantId: string) => {
    const property = await prisma.property.findUnique({
        where: {
            id: payload.propertyId,
        },
    });

    if (!property) {
        throw new Error('Property not found.');
    }

    if (property.status !== 'AVAILABLE') {
        throw new Error('Property is not available.');
    }

    const alreadyRequested = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId,
        },
    });

    if (alreadyRequested) {
        throw new Error('Rental request already submitted.');
    }

    const rental = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId: payload.propertyId,
            moveInDate: new Date(payload.moveInDate),
            message: payload.message,
        },
        include: {
            tenant: true,
            property: true,
        },
    });

    return rental;
};

const getMyRentalsFromDB = async (tenantId: string) => {
    const rentals = await prisma.rentalRequest.findMany({
        where: {
            tenantId,
        },
        include: {
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

    return rentals;
};

const getSingleRentalFromDB = async (id: string, tenantId: string) => {
    const rental = await prisma.rentalRequest.findFirst({
        where: {
            id,
            tenantId,
        },
        include: {
            property: {
                include: {
                    landlord: true,
                    category: true,
                },
            },
            payment: true,
        },
    });

    if (!rental) {
        throw new Error('Rental request not found.');
    }

    return rental;
};

export const rentalService = {
    createRentalIntoDB,
    getMyRentalsFromDB,
    getSingleRentalFromDB,
};
