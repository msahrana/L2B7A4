import { propertyController } from './property.controller';
import express from 'express';

const router = express.Router();

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getSingleProperty);

export const propertyRoute = router;
