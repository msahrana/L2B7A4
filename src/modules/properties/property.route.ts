import { propertyController } from './property.controller';
import { Router } from 'express';

const router = Router();

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getSingleProperty);
router.get('/:id/reviews', propertyController.getPropertyReviews);

export const propertyRoute = router;
