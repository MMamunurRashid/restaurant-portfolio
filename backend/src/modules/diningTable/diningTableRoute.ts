import express from 'express';
import { auth } from '../../middlewares/auth';
import verifyValidate from '../../middlewares/verifyValidate';
import {
  addDiningTableController,
  deleteDiningTableController,
  getAllDiningTableController,
  getDiningTableCountsController,
  getSingleDiningTableController,
  updateDiningTableController,
} from './diningTableController';
import {
  diningTableValidation,
  updateDiningTableValidation,
} from './diningTableValidation';

const Router = express.Router();

Router.post(
  '/add',
  auth('superAdmin', 'admin'),
  verifyValidate(diningTableValidation),
  addDiningTableController,
);
Router.get('/all', auth('superAdmin', 'admin'), getAllDiningTableController);
Router.get('/counts', auth('superAdmin', 'admin'), getDiningTableCountsController);
Router.get('/:id', auth('superAdmin', 'admin'), getSingleDiningTableController);
Router.patch(
  '/update/:id',
  auth('superAdmin', 'admin'),
  verifyValidate(updateDiningTableValidation),
  updateDiningTableController,
);
Router.delete(
  '/delete/:id',
  auth('superAdmin', 'admin'),
  deleteDiningTableController,
);

export const diningTableRoute = Router;
