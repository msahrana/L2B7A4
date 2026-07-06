import { prisma } from '../../lib/prisma';

const createCategoryIntoDB = async (payload: {
    name: string;
    description?: string;
}) => {
    const isExist = await prisma.category.findUnique({
        where: {
            name: payload.name,
        },
    });

    if (isExist) {
        throw new Error('Category already exists.');
    }

    const result = await prisma.category.create({
        data: {
            name: payload.name,
            description: payload.description,
        },
    });

    return result;
};

const getAllCategoriesFromDB = async () => {
    return prisma.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const getSingleCategoryFromDB = async (id: string) => {
    const result = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!result) {
        throw new Error('Category not found.');
    }

    return result;
};

const updateCategoryIntoDB = async (
    id: string,
    payload: {
        name?: string;
        description?: string;
    },
) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!category) {
        throw new Error('Category not found.');
    }

    return prisma.category.update({
        where: {
            id,
        },
        data: payload,
    });
};

const deleteCategoryFromDB = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!category) {
        throw new Error('Category not found.');
    }

    return prisma.category.delete({
        where: {
            id,
        },
    });
};

export const CategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategoryFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
};
