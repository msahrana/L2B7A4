import { sendResponse } from '../../utils/sendResponse';
import { propertyService } from './property.service';
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyService.getAllPropertiesFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Properties retrieved successfully.',
        data: result,
    });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyService.getSinglePropertyFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Single Property retrieved successfully.',
        data: result,
    });
});

const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await propertyService.getPropertyReviewsFromDB(
        id as string,
        req.query,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Property reviews retrieved successfully.',
        meta: result.meta,
        data: result.data,
    });
});

export const propertyController = {
    getAllProperties,
    getSingleProperty,
    getPropertyReviews,
};
