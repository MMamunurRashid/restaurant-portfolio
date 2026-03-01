import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IAppointment } from './appointmentInterface';
import { Appointment } from './appointmentModel';
import QueryBuilder from '../../builders/QueryBuilder';

export const addAppointmentService = async (data: IAppointment) => {
  const result = await Appointment.create({ ...data });
  return result;
};

export const getAllAppointmentService = async (
  query: Record<string, unknown>,
) => {
  const result = new QueryBuilder(Appointment.find().populate('service'), query)
    .search(['name', 'phone', 'email', 'location', 'occupation'])
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
  const result = await Appointment.findById(id).populate('service');
  return result;
};

export const updateAppointmentService = async (
  id: string,
  data: IAppointment,
) => {
  const isExist = await Appointment.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Appointment not found !');

  const result = await Appointment.findByIdAndUpdate(
    id,
    { ...data },
    { new: true },
  );
  return result;
};

export const deleteAppointmentService = async (id: string) => {
  const isExist = await Appointment.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Appointment not found !');

  await Appointment.findByIdAndDelete(id);
  return true;
};

export const getAppointmentCountsService = async () => {
  const totalAppointments = await Appointment.countDocuments();
  const unreadAppointments = await Appointment.countDocuments({
    isRead: false,
  });
  return { totalAppointments, unreadAppointments };
};
