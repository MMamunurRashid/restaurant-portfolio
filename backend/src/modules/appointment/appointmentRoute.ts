import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  addAppointmentController,
  deleteAppointmentController,
  getAllAppointmentController,
  getAppointmentCountsController,
  getSingleAppointmentController,
  updateAppointmentController,
} from './appointmentController';
import {
  appointmentValidation,
  updateAppointmentValidation,
} from './appointmentValidation';

Router.post(
  '/add',
  verifyValidate(appointmentValidation),
  addAppointmentController,
);
Router.get('/all', getAllAppointmentController);
Router.get('/counts', getAppointmentCountsController);
Router.get('/:id', getSingleAppointmentController);
Router.patch(
  '/update/:id',
  verifyValidate(updateAppointmentValidation),
  updateAppointmentController,
);
Router.delete('/delete/:id', deleteAppointmentController);

export const appointmentRoute = Router;
