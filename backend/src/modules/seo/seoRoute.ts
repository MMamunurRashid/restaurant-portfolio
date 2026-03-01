import express from 'express';
const Router = express.Router();
import {
  createSeoController,
  getSeoController,
  updateSeoController,
} from './seoController';
import { seoValidation, updateSeoValidation } from './seoValidation';
import verifyValidate from '../../middlewares/verifyValidate';

Router.post('/add', verifyValidate(seoValidation), createSeoController);
Router.get('/', getSeoController);
Router.patch(
  '/update/:id',
  verifyValidate(updateSeoValidation),
  updateSeoController,
);

export const seoRoute = Router;
