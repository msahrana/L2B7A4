import { reviewController } from './review.controller';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/', auth(Role.TENANT), reviewController.createReview);

export const reviewRoute = router;
