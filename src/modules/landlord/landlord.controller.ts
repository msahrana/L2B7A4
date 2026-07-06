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

export const landlordController = { createProperties };
