import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';
import { adminController } from './admin.controller';

const router = Router();

router.get('/users', auth(Role.ADMIN), adminController.getAllUsers);

router.patch('/users/:id', auth(Role.ADMIN), adminController.updateUserStatus);

router.get('/properties', auth(Role.ADMIN), adminController.getAllProperties);

router.get('/rentals', auth(Role.ADMIN), adminController.getAllRentals);

router.get(
    '/dashboard',
    auth(Role.ADMIN),
    adminController.getDashboardStats,
);

export const adminRoute = router;
