import { Router } from 'express';

const router = Router();

router.post('/create');
router.post('/confirm');
router.get('/');
router.post('/:id');

export const paymentRoute = router;
