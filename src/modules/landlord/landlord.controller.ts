import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { landlordService } from './landlord.service';
import { catchAsync } from '../../utils/catchAsync';
import HttpStatus from 'http-status';

const createProperties = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const landlordId = req.user?.id;

        const property = await landlordService.createPropertyIntoDB(
            req.body,
            landlordId as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.CREATED,
            message: 'Property Created Successfully!',
            data: { property },
        });
    },
);

const getPropertyRequests = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user!.id;

    const result = await landlordService.getAllPropertiesIntoDB(landlordId);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Properties requests retrieved successfully.',
        data: result,
    });
});

const getRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user!.id;

    const result = await landlordService.getAllRentalRequestsFromDB(landlordId);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Rental requests retrieved successfully.',
        data: result,
    });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await landlordService.getSinglePropertyIntoDB(id as string);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Single Property retrieved successfully.',
        data: result,
    });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const landlordId = req.user?.id;

    const result = await landlordService.updatePropertyIntoDB(
        id as string,
        req.body,
        landlordId as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Property updated successfully.',
        data: result,
    });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const landlordId = req.user!.id;

    await landlordService.deletePropertyIntoDB(id as string, landlordId);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Property deleted successfully.',
        data: null,
    });
});

export const landlordController = {
    createProperties,
    getPropertyRequests,
    getRentalRequests,
    getSingleProperty,
    updateProperty,
    deleteProperty,
};
