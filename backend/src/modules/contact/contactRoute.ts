import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  contactValidation,
  updateContactValidation,
} from './contactValidation';
import {
  addContactController,
  getContactController,
  updateContactController,
} from './contactController';

Router.post('/add', verifyValidate(contactValidation), addContactController);
Router.get('/', getContactController);
Router.patch(
  '/update/:id',
  verifyValidate(updateContactValidation),
  updateContactController,
);

export const contactRoute = Router;
