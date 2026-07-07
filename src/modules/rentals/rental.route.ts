import { Router } from 'express';
import { rentalController } from './rental.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.post('/', auth(Role.TENANT), rentalController.createRental);
router.get('/', auth(Role.TENANT), rentalController.getMyRentals);
router.get('/:id', auth(Role.TENANT), rentalController.getSingleRental);

export const rentalRoute = router;
