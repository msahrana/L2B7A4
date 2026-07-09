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
router.get('/', auth(Role.TENANT), paymentController.getMyPaymentHistory);
router.get(
    '/:id',
    auth(Role.TENANT, Role.ADMIN),
    paymentController.getSinglePaymentData,
);

export const paymentRoute = router;
