import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  privacyPolicyValidation,
  updatePrivacyPolicyValidation,
} from './privacyPolicyValidation';
import {
  addPrivacyPolicyController,
  getPrivacyPolicyController,
  updatePrivacyPolicyController,
} from './privacyPolicyController';

Router.post(
  '/add',
  verifyValidate(privacyPolicyValidation),
  addPrivacyPolicyController,
);
Router.get('/', getPrivacyPolicyController);
Router.patch(
  '/update/:id',
  verifyValidate(updatePrivacyPolicyValidation),
  updatePrivacyPolicyController,
);

export const privacyPolicyRoute = Router;
