import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { paymentService } from './payment.service';
import httpStatus from 'http-status';
import { Role } from '../../../generated/prisma/enums';

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        console.log('Body:', req.body);
        console.log('Headers:', req.headers['content-type']);

        const rentalRequestId = req.body?.rentalRequestId;

        if (!rentalRequestId) {
            throw new Error('Rental Request ID is required');
        }

        const result =
            await paymentService.createCheckoutSessionIntoDB(rentalRequestId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Checkout completed successfully!',
            data: result,
        });
    },
);

const handleWebhook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;

        await paymentService.handleWebhookIntoDB(event, signature as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Webhook triggered successfully!',
            data: null,
        });
    },
);

const getMyPaymentHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await paymentService.getMyPaymentHistoryIntoDB(
        userId as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Payment history retrieved successfully.',
        data: result,
    });
});

const getSinglePaymentData = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const userId = req.user?.id;
    const role = req.user?.role;

    const result = await paymentService.getSinglePaymentDataIntoDB(
        id as string,
        userId as string,
        role as Role,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Single Payment retrieved successfully!',
        data: result,
    });
});

export const paymentController = {
    createCheckoutSession,
    handleWebhook,
    getMyPaymentHistory,
    getSinglePaymentData,
};
