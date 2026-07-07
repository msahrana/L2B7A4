import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { rentalService } from './rental.service';
import httpStatus from 'http-status';

const createRental = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id as string;

    const result = await rentalService.createRentalIntoDB(req.body, tenantId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Rental request submitted successfully.',
        data: result,
    });
});

const getMyRentals = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id as string;

    const result = await rentalService.getMyRentalsFromDB(tenantId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Rental requests retrieved successfully.',
        data: result,
    });
});

const getSingleRental = catchAsync(async (req: Request, res: Response) => {
    const rental = req.params?.id as string;
    const tenantId = req.user?.id;

    const result = await rentalService.getSingleRentalFromDB(
        rental,
        tenantId as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Single Rental request retrieved successfully.',
        data: result,
    });
});

export const rentalController = { createRental, getMyRentals, getSingleRental };
