import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { IBanner } from './bannerInterface';
import { Banner } from './bannerModel';

export const addBannerService = async (data: IBanner) => {
  const result = await Banner.create(data);
  return result;
};

export const getAllBannerService = async () => {
  const result = await Banner.find({});
  return result;
};

export const getSingleBannerService = async (id: string) => {
  const result = await Banner.findById(id);
  return result;
};

export const updateBannerService = async (id: string, data: IBanner) => {
  const isExist = await Banner.findById(id);
  if (!isExist) {
    deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found !');
  }

  const result = await Banner.findByIdAndUpdate(id, data, { new: true });
  if (result && data?.image) deleteFile(`./uploads/${isExist?.image}`);
  return result;
};

export const deleteBannerService = async (id: string) => {
  const isExist = await Banner.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Banner not found !');
  }

  await Banner.findByIdAndDelete(id);
  deleteFile(`./uploads/${isExist?.image}`);
  return true;
};
