import AppError from '../../errors/AppError';
import { ISeo } from './seoInterface';
import { SEO } from './seoModel';
import httpStatus from 'http-status';

export const createSeoService = async (data: ISeo) => {
  const isExist = await SEO.findOne();
  if (isExist) throw new AppError(httpStatus.BAD_REQUEST, 'SEO already exist');

  const result = await SEO.create(data);
  return result;
};

export const getSeoService = async () => {
  const result = await SEO.findOne();
  return result;
};

export const updateSeoService = async (id: string, data: ISeo) => {
  const isExist = await SEO.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'SEO not found');

  const result = await SEO.findByIdAndUpdate(id, data, { new: true });
  return result;
};
