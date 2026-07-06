import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { authService } from './auth.service';
import HttpStatus from 'http-status';

const registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        const user = await authService.registerUserIntoDB(payload);

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.CREATED,
            message: 'User Created Successfully!',
            data: { user },
        });
    },
);

export const authController = { registerUser };
