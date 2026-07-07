import { propertyController } from './property.controller';
import { Router } from 'express';

const router = Router();

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getSingleProperty);

export const propertyRoute = router;
