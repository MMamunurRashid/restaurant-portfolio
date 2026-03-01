import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { IGeneralSetting } from './generalSettingInterface';
import { GeneralSetting } from './generalSettingModel';

export const addGeneralSettingService = async (data: IGeneralSetting) => {
  const result = await GeneralSetting.create(data);
  return result;
};

export const getGeneralSettingService = async () => {
  const result = await GeneralSetting.findOne({});
  return result;
};

export const getSingleGeneralSettingService = async (id: string) => {
  const result = await GeneralSetting.findById(id);
  return result;
};

export const updateGeneralSettingService = async (
  id: string,
  data: IGeneralSetting,
) => {
  const isExist = await GeneralSetting.findById(id);
  if (!isExist) {
    if (data?.logo) deleteFile(`./uploads/${data?.logo}`);
    if (data?.favicon) deleteFile(`./uploads/${data?.favicon}`);
    if (data?.footerImage) deleteFile(`./uploads/${data?.footerImage}`);
    throw new AppError(httpStatus.NOT_FOUND, 'General Setting not found !');
  }

  const result = await GeneralSetting.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (result) {
    if (data?.logo) deleteFile(`./uploads/${isExist?.logo}`);
    if (data?.favicon) deleteFile(`./uploads/${isExist?.favicon}`);
    if (data?.footerImage) deleteFile(`./uploads/${isExist?.footerImage}`);
  }

  return result;
};

export const deleteGeneralSettingService = async (id: string) => {
  const isExist = await GeneralSetting.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'General Setting not found !');
  }

  await GeneralSetting.findByIdAndDelete(id);

  if (isExist?.logo) deleteFile(`./uploads/${isExist?.logo}`);
  if (isExist?.favicon) deleteFile(`./uploads/${isExist?.favicon}`);
  if (isExist?.footerImage) deleteFile(`./uploads/${isExist?.footerImage}`);

  return true;
};
