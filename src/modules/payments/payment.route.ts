import { paymentController } from './payment.controller';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/auth';
import { Router } from 'express';

const router = Router();

router.post(
    '/create',
    auth(Role.TENANT),
    paymentController.createCheckoutSession,
);
router.post('/webhook', paymentController.handleWebhook);
// router.get('/');
// router.post('/:id');

export const paymentRoute = router;
