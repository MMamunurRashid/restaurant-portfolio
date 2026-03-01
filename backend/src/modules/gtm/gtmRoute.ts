import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import { gtmValidation } from './gtmValidation';
import {
  createGtmController,
  getGtmController,
  updateGtmController,
} from './gtmController';

Router.post('/add', verifyValidate(gtmValidation), createGtmController);
Router.get('/', getGtmController);
Router.patch('/update/:id', verifyValidate(gtmValidation), updateGtmController);

export const gtmRoute = Router;
