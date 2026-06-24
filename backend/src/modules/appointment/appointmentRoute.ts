import express from 'express';
const Router = express.Router();
import { auth } from '../../middlewares/auth';
import verifyValidate from '../../middlewares/verifyValidate';
import {
  addAppointmentController,
  assignAppointmentTableController,
  deleteAppointmentController,
  getAllAppointmentController,
  getAppointmentCountsController,
  getAvailableAppointmentSlotsController,
  getSingleAppointmentController,
  markAppointmentAsReadController,
  sendAppointmentReminderController,
  updateAppointmentController,
} from './appointmentController';
import {
  assignTableValidation,
  appointmentValidation,
  updateAppointmentValidation,
} from './appointmentValidation';

Router.post(
  '/add',
  verifyValidate(appointmentValidation),
  addAppointmentController,
);
Router.get('/available-slots', getAvailableAppointmentSlotsController);
Router.get('/all', auth('superAdmin', 'admin'), getAllAppointmentController);
Router.get('/counts', auth('superAdmin', 'admin'), getAppointmentCountsController);
Router.patch(
  '/mark-as-read/:id',
  auth('superAdmin', 'admin'),
  markAppointmentAsReadController,
);
Router.patch(
  '/assign-table/:id',
  auth('superAdmin', 'admin'),
  verifyValidate(assignTableValidation),
  assignAppointmentTableController,
);
Router.post(
  '/send-reminder/:id',
  auth('superAdmin', 'admin'),
  sendAppointmentReminderController,
);
Router.get('/:id', auth('superAdmin', 'admin'), getSingleAppointmentController);
Router.patch(
  '/update/:id',
  auth('superAdmin', 'admin'),
  verifyValidate(updateAppointmentValidation),
  updateAppointmentController,
);
Router.delete(
  '/delete/:id',
  auth('superAdmin', 'admin'),
  deleteAppointmentController,
);

export const appointmentRoute = Router;
