import { favoriteController } from './favorite.controller';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/', auth(Role.TENANT), favoriteController.createFavorite);
router.get('/', auth(Role.TENANT), favoriteController.getMyFavorites);
router.delete(
    '/:propertyId',
    auth(Role.TENANT),
    favoriteController.deleteFavorite,
);

export const favoriteRoute = router;
