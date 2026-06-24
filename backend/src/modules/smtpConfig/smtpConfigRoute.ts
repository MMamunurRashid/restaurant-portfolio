import express from 'express';
import { auth } from '../../middlewares/auth';
import verifyValidate from '../../middlewares/verifyValidate';
import {
  getSmtpConfigController,
  updateSmtpConfigController,
} from './smtpConfigController';
import { smtpConfigValidation } from './smtpConfigValidation';

const Router = express.Router();

Router.get('/', auth('superAdmin', 'admin'), getSmtpConfigController);
Router.patch(
  '/update',
  auth('superAdmin', 'admin'),
  verifyValidate(smtpConfigValidation),
  updateSmtpConfigController,
);

export const smtpConfigRoute = Router;
