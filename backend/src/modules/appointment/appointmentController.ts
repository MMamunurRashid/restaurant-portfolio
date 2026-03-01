import { catchAsync } from '../../utils/catchAsync';
import {
  addAppointmentService,
  deleteAppointmentService,
  getAllAppointmentService,
  getAppointmentCountsService,
  getSingleAppointmentService,
  updateAppointmentService,
} from './appointmentService';

export const addAppointmentController = catchAsync(async (req, res) => {
  const result = await addAppointmentService(req.body);

  res.status(200).json({
    success: true,
    message: 'Appointment add successfully',
    data: result,
  });
});

export const getAllAppointmentController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllAppointmentService(req.query);

  res.status(200).json({
    success: true,
    message: 'Appointments get successfully',
    meta,
    data,
  });
});

export const getSingleAppointmentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleAppointmentService(id);

  res.status(200).json({
    success: true,
    message: 'Appointment get successfully',
    data: result,
  });
});

export const updateAppointmentController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await updateAppointmentService(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Appointment update successfully',
    data: result,
  });
});

export const deleteAppointmentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteAppointmentService(id);

  res.status(200).json({
    success: true,
    message: 'Appointment delete successfully',
  });
});

export const getAppointmentCountsController = catchAsync(async (req, res) => {
  const result = await getAppointmentCountsService();

  res.status(200).json({
    success: true,
    message: 'Appointment counts fetched successfully',
    data: result,
  });
});
