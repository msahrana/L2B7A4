import { PaymentStatus } from '../../generated/prisma/enums';
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { prisma } from '../lib/prisma';

export const subscriptionGuard = () => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const rentalRequestId = req.user?.id;

            const payment = await prisma.payment.findUnique({
                where: {
                    id: rentalRequestId,
                },
            });

            if (!payment) {
                throw new Error(
                    'Please subscribe to get access to Premium Contents',
                );
            }

            if (payment?.status !== PaymentStatus.PENDING) {
                throw new Error(
                    'Please subscribe again to get access to Premium Contents',
                );
            }

            next();
        },
    );
};
