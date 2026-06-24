import { catchAsync } from '../../utils/catchAsync';
import {
  getAvailableReservationSlotsService,
} from '../reservationSetting/reservationSettingService';
import {
  addAppointmentService,
  assignAppointmentTableService,
  deleteAppointmentService,
  getAllAppointmentService,
  getAppointmentCountsService,
  getSingleAppointmentService,
  markAppointmentAsReadService,
  sendAppointmentReminderService,
  updateAppointmentService,
} from './appointmentService';

export const addAppointmentController = catchAsync(async (req, res) => {
  const result = await addAppointmentService(req.body);

  res.status(200).json({
    success: true,
    message: 'Reservation added successfully',
    data: result,
  });
});

export const getAllAppointmentController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllAppointmentService(req.query);

  res.status(200).json({
    success: true,
    message: 'Reservations fetched successfully',
    meta,
    data,
  });
});

export const getSingleAppointmentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleAppointmentService(id);

  res.status(200).json({
    success: true,
    message: 'Reservation fetched successfully',
    data: result,
  });
});

export const updateAppointmentController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await updateAppointmentService(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Reservation updated successfully',
    data: result,
  });
});

export const deleteAppointmentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteAppointmentService(id);

  res.status(200).json({
    success: true,
    message: 'Reservation deleted successfully',
  });
});

export const getAppointmentCountsController = catchAsync(async (req, res) => {
  const result = await getAppointmentCountsService();

  res.status(200).json({
    success: true,
    message: 'Reservation counts fetched successfully',
    data: result,
  });
});

export const getAvailableAppointmentSlotsController = catchAsync(
  async (req, res) => {
    const result = await getAvailableReservationSlotsService(req.query);

    res.status(200).json({
      success: true,
      message: 'Available reservation slots fetched successfully',
      data: result,
    });
  },
);

export const markAppointmentAsReadController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await markAppointmentAsReadService(id);

  res.status(200).json({
    success: true,
    message: 'Reservation marked as read successfully',
    data: result,
  });
});

export const assignAppointmentTableController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await assignAppointmentTableService(id, req.body.tableId);

  res.status(200).json({
    success: true,
    message: req.body.tableId
      ? 'Table assigned successfully'
      : 'Table assignment removed successfully',
    data: result,
  });
});

export const sendAppointmentReminderController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await sendAppointmentReminderService(id);

    res.status(200).json({
      success: true,
      message: 'Reservation reminder sent successfully',
      data: result,
    });
  },
);
