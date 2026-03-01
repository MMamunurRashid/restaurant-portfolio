import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { IService } from './serviceInterface';
import { Service } from './serviceModel';

export const createServiceService = async (data: IService) => {
  const result = await Service.create(data);
  return result;
};

export const getAllServiceService = async (query: Record<string, unknown>) => {
  const ServiceQuery = new QueryBuilder(Service.find(), query)
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await ServiceQuery.countTotal();
  const data = await ServiceQuery.modelQuery;

  return {
    meta,
    data,
  };
};

export const getByIdServiceService = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

export const getBySlugServiceService = async (slug: string) => {
  const result = await Service.findOne({ slug });
  return result;
};

export const updateServiceService = async (id: string, data: IService) => {
  const isExist = await Service.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Service not found');

  const result = await Service.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const deleteServiceService = async (id: string) => {
  const isExist = await Service.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Service not found');

  const result = await Service.findByIdAndDelete(id);
  if (result) {
    deleteFile(`./uploads/${isExist?.thumbnail}`);
    if (isExist?.icon) {
      deleteFile(`./uploads/${isExist.icon}`);
    }
    if ((isExist?.galleries?.length ?? 0) > 0) {
      isExist?.galleries?.forEach((gallery: string) => {
        deleteFile(`./uploads/${gallery}`);
      });
    }
  }

  return result;
};

export const updateServiceActiveService = async (id: string) => {
  const isExist = await Service.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Service not found');

  const result = await Service.findByIdAndUpdate(id, {
    isActive: !isExist.isActive,
  });
  return result;
};

export const getServiceCountService = async () => {
  const totalService = await Service.countDocuments();
  const ongoingService = await Service.countDocuments({ status: 'ongoing' });
  const upcomingService = await Service.countDocuments({ status: 'upcoming' });
  const completedService = await Service.countDocuments({
    status: 'completed',
  });
  return {
    totalService,
    ongoingService,
    upcomingService,
    completedService,
  };
};
