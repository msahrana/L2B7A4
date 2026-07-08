import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { paymentService } from './payment.service';
import httpStatus from 'http-status';

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

export const paymentController = { createCheckoutSession, handleWebhook };
