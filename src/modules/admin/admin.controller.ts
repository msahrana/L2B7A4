import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { adminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsersFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Users retrieved successfully by Admin!!',
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.updateUserStatusIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User status updated successfully by Admin!',
        data: result,
    });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllPropertiesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Properties retrieved successfully by Admin!',
        data: result,
    });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllRentalsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Rental requests retrieved successfully by Admin!',
        data: result,
    });
});

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
};
