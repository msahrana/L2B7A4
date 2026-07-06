import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.createCategoryIntoDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'Category created successfully',
        data: result,
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAllCategoriesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Categories retrieved successfully',
        data: result,
    });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getSingleCategoryFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Category retrieved successfully',
        data: result,
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.updateCategoryIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Category updated successfully',
        data: result,
    });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await CategoryService.deleteCategoryFromDB(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Category deleted successfully',
        data: null,
    });
});

export const CategoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
