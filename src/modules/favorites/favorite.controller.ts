import { sendResponse } from '../../utils/sendResponse';
import { favoriteService } from './favorite.service';
import { catchAsync } from '../../utils/catchAsync';
import { Request, Response } from 'express';
import HttpStatus from 'http-status';

const createFavorite = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await favoriteService.createFavoriteIntoDB(userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Favorite Property created successfully!',
        data: result,
    });
});

const getMyFavorites = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await favoriteService.getMyFavoritesFromDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Favorite properties retrieved successfully!',
        data: result,
    });
});

const deleteFavorite = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { propertyId } = req.params;

    const result = await favoriteService.deleteFavoriteFromDB(
        userId,
        propertyId as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Property removed from favorites successfully!',
        data: result,
    });
});

export const favoriteController = {
    createFavorite,
    getMyFavorites,
    deleteFavorite,
};
