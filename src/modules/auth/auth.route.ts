import { Role } from '../../../generated/prisma/enums';
import { authController } from './auth.controller';
import { auth } from '../../middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshToken);
router.get(
    '/me',
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
    authController.getMyProfile,
);
router.put(
    '/my-profile',
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
    authController.updateMyProfile,
);
router.post(
    '/change-password',
    auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
    authController.changePassword,
);

export const authRoute = router;
