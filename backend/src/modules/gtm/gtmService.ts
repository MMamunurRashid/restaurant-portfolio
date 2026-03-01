import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IGtm } from './gtmInterface';
import { GTM } from './gtmModel';

export const createGtmService = async (data: IGtm) => {
  const isExist = await GTM.findOne();
  if (isExist) throw new AppError(httpStatus.BAD_REQUEST, 'Gtm already exist');

  const result = await GTM.create(data);
  return result;
};

export const getGtmService = async () => {
  const result = await GTM.findOne();
  return result;
};

export const updateGtmService = async (id: string, data: IGtm) => {
  const isExist = await GTM.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Gtm not found');

  const result = await GTM.findByIdAndUpdate(id, data, { new: true });
  return result;
};
