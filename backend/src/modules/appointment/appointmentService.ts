import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { IAppointment, TAppointmentStatus } from './appointmentInterface';
import { Appointment } from './appointmentModel';
import QueryBuilder from '../../builders/QueryBuilder';
import {
  sendReservationReminderNotification,
  sendReservationNotifications,
  sendReservationStatusNotification,
} from '../../utils/notificationMail';
import { assertAppointmentSlotAvailable } from '../reservationSetting/reservationSettingService';
import { DiningTable } from '../diningTable/diningTableModel';
import { IDiningTable } from '../diningTable/diningTableInterface';

type PopulatedPackage = {
  _id?: Types.ObjectId;
  title?: string;
  price?: number;
  services?: string[];
  thumbnail?: string;
};

const buildReservationCode = (id: unknown) =>
  `RES-${String(id).slice(-8).toUpperCase()}`;

const getPackageSnapshot = (packages?: unknown[]) =>
  (packages || [])
    .filter((item): item is PopulatedPackage => {
      if (!item || typeof item !== 'object') return false;
      return 'title' in item || 'price' in item;
    })
    .map((pkg) => ({
      package: pkg._id,
      title: pkg.title || 'Dining package',
      price: pkg.price,
      services: pkg.services || [],
      thumbnail: pkg.thumbnail,
    }));

const getTableSnapshot = (
  table: IDiningTable & { _id?: Types.ObjectId },
) => ({
  table: table._id,
  tableNumber: table.tableNumber,
  capacity: table.capacity,
  area: table.area,
});

const statusTimestampField: Partial<Record<TAppointmentStatus, string>> = {
  confirmed: 'confirmedAt',
  cancelled: 'cancelledAt',
  completed: 'completedAt',
  no_show: 'noShowAt',
};

export const addAppointmentService = async (data: IAppointment) => {
  await assertAppointmentSlotAvailable(data);

  const result = await Appointment.create({
    ...data,
    status: 'pending',
    isRead: false,
    source: 'website',
  });
  const populatedResult = await result.populate('packages');

  populatedResult.reservationCode =
    populatedResult.reservationCode || buildReservationCode(populatedResult._id);
  populatedResult.packageSnapshot = getPackageSnapshot(
    populatedResult.packages as unknown[],
  );
  await populatedResult.save();

  await sendReservationNotifications(populatedResult);
  return populatedResult;
};

export const getAllAppointmentService = async (
  query: Record<string, unknown>,
) => {
  const result = new QueryBuilder(
    Appointment.find().populate('packages').populate('assignedTable'),
    query,
  )
    .search(['name', 'phone', 'email', 'address'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await result.countTotal();
  const data = await result.modelQuery;

  return {
    meta,
    data,
  };
};

export const getSingleAppointmentService = async (id: string) => {
  const result = await Appointment.findById(id)
    .populate('packages')
    .populate('assignedTable');
  return result;
};

export const updateAppointmentService = async (
  id: string,
  data: Partial<IAppointment>,
) => {
  const isExist = await Appointment.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Reservation not found !');

  const previousStatus = isExist.status;
  const updatePayload: Record<string, unknown> = { ...data };

  if (data.status) {
    updatePayload.isRead = true;

    const timestampField = statusTimestampField[data.status];
    if (timestampField && !isExist.get(timestampField)) {
      updatePayload[timestampField] = new Date();
    }
  }

  const result = await Appointment.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true },
  )
    .populate('packages')
    .populate('assignedTable');

  if (result && data.status && data.status !== previousStatus) {
    await sendReservationStatusNotification(result);
  }

  return result;
};

export const deleteAppointmentService = async (id: string) => {
  const isExist = await Appointment.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Reservation not found !');

  await Appointment.findByIdAndDelete(id);
  return true;
};

export const getAppointmentCountsService = async () => {
  const totalAppointments = await Appointment.countDocuments();
  const unreadAppointments = await Appointment.countDocuments({
    isRead: { $ne: true },
  });
  const pendingAppointments = await Appointment.countDocuments({
    $or: [{ status: 'pending' }, { status: { $exists: false } }],
  });
  const confirmedAppointments = await Appointment.countDocuments({
    status: 'confirmed',
  });
  const cancelledAppointments = await Appointment.countDocuments({
    status: 'cancelled',
  });

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const todayAppointments = await Appointment.countDocuments({
    date: { $gte: start, $lte: end },
  });

  return {
    totalAppointments,
    unreadAppointments,
    pendingAppointments,
    confirmedAppointments,
    cancelledAppointments,
    todayAppointments,
  };
};

export const markAppointmentAsReadService = async (id: string) => {
  const isExist = await Appointment.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Reservation not found !');
  if (isExist.isRead) return isExist.populate('packages');

  isExist.isRead = true;
  const result = await isExist.save();
  return result.populate(['packages', 'assignedTable']);
};

export const assignAppointmentTableService = async (
  id: string,
  tableId?: string | null,
) => {
  const appointment = await Appointment.findById(id);
  if (!appointment)
    throw new AppError(httpStatus.NOT_FOUND, 'Reservation not found !');

  if (!tableId) {
    appointment.assignedTable = undefined;
    appointment.tableSnapshot = undefined;
    appointment.tableAssignedAt = undefined;
    appointment.isRead = true;
    const result = await appointment.save();
    return result.populate(['packages', 'assignedTable']);
  }

  const table = await DiningTable.findById(tableId);
  if (!table) throw new AppError(httpStatus.NOT_FOUND, 'Table not found !');
  if (!table.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This table is inactive');
  }

  if (table.capacity < (appointment.guestCount || 1)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Table capacity is lower than reservation guest count',
    );
  }

  const start = new Date(appointment.date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(appointment.date);
  end.setUTCHours(23, 59, 59, 999);

  const conflict = await Appointment.findOne({
    _id: { $ne: appointment._id },
    assignedTable: table._id,
    date: { $gte: start, $lte: end },
    time: appointment.time,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (conflict) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This table is already assigned for the selected date and time',
    );
  }

  appointment.assignedTable = table._id as Types.ObjectId;
  appointment.tableSnapshot = getTableSnapshot(
    table.toObject() as IDiningTable & { _id?: Types.ObjectId },
  );
  appointment.tableAssignedAt = new Date();
  appointment.isRead = true;
  const result = await appointment.save();
  return result.populate(['packages', 'assignedTable']);
};

export const sendAppointmentReminderService = async (id: string) => {
  const appointment = await Appointment.findById(id)
    .populate('packages')
    .populate('assignedTable');

  if (!appointment)
    throw new AppError(httpStatus.NOT_FOUND, 'Reservation not found !');

  if (!appointment.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Guest email is required to send a reminder',
    );
  }

  if (appointment.status !== 'confirmed') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only confirmed reservations can receive reminders',
    );
  }

  const isSent = await sendReservationReminderNotification(appointment);
  if (!isSent) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Reminder email could not be sent. Check SMTP settings.',
    );
  }

  appointment.reminderSentAt = new Date();
  const result = await appointment.save();
  return result.populate(['packages', 'assignedTable']);
};
