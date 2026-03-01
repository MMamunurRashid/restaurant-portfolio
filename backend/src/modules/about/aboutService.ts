import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { IAbout } from './aboutInterface';
import { About } from './aboutModel';

export const addAboutService = async (data: IAbout) => {
  const result = await About.create(data);
  return result;
};

export const getAboutService = async () => {
  const result = await About.findOne({});
  return result;
};

export const getSingleAboutService = async (id: string) => {
  const result = await About.findById(id);
  return result;
};

export const updateAboutService = async (id: string, data: IAbout) => {
  const isExist = await About.findById(id);
  if (!isExist) {
    if (data?.image) deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.NOT_FOUND, 'About not found !');
  }

  const result = await About.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (result) {
    if (data?.image) deleteFile(`./uploads/${isExist?.image}`);
  }

  return result;
};

export const deleteAboutService = async (id: string) => {
  const isExist = await About.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'About not found !');
  }

  await About.findByIdAndDelete(id);

  if (isExist?.image) deleteFile(`./uploads/${isExist?.image}`);

  return true;
};
