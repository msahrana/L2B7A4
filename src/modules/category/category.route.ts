import express from 'express';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';
import { CategoryController } from './category.controller';
// import { CategoryController } from "./category.controller";
// import auth from "../../middlewares/auth";

const router = express.Router();

router.post('/', auth(Role.LANDLORD), CategoryController.createCategory);

router.get('/', CategoryController.getAllCategories);

router.get('/:id', CategoryController.getSingleCategory);

router.put('/:id', auth(Role.ADMIN), CategoryController.updateCategory);

router.delete('/:id', auth(Role.ADMIN), CategoryController.deleteCategory);

export const categoryRoute = router;
