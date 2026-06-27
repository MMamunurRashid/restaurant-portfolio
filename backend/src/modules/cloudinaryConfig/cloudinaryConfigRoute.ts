import express from 'express';
import { auth } from '../../middlewares/auth';
import verifyValidate from '../../middlewares/verifyValidate';
import {
  getCloudinaryConfigController,
  updateCloudinaryConfigController,
} from './cloudinaryConfigController';
import { cloudinaryConfigValidation } from './cloudinaryConfigValidation';

const Router = express.Router();

Router.get('/', auth('superAdmin', 'admin'), getCloudinaryConfigController);
Router.patch(
  '/update',
  auth('superAdmin', 'admin'),
  verifyValidate(cloudinaryConfigValidation),
  updateCloudinaryConfigController,
);

export const cloudinaryConfigRoute = Router;
