import express from 'express';
import { auth } from '../../middlewares/auth';
import verifyValidate from '../../middlewares/verifyValidate';
import {
  getReservationSettingController,
  updateReservationSettingController,
} from './reservationSettingController';
import { reservationSettingValidation } from './reservationSettingValidation';

const Router = express.Router();

Router.get('/', auth('superAdmin', 'admin'), getReservationSettingController);
Router.patch(
  '/update',
  auth('superAdmin', 'admin'),
  verifyValidate(reservationSettingValidation),
  updateReservationSettingController,
);

export const reservationSettingRoute = Router;
