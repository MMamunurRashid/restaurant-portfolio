import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  termConditionValidation,
  updateTermConditionValidation,
} from './termConditionValidation';
import {
  addTermConditionController,
  getTermConditionController,
  updateTermConditionController,
} from './termConditionController';

Router.post(
  '/add',
  verifyValidate(termConditionValidation),
  addTermConditionController,
);
Router.get('/', getTermConditionController);

Router.patch(
  '/update/:id',
  verifyValidate(updateTermConditionValidation),
  updateTermConditionController,
);

export const termConditionRoute = Router;
