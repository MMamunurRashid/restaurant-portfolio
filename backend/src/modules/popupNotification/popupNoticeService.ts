import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { IPopupNotice } from './popupNoticeInterface';
import { PopupNotice } from './popupNoticeModel';

export const addPopupNoticeService = async (data: IPopupNotice) => {
  const isExist = await PopupNotice.findOne();
  if (isExist) {
    deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.BAD_REQUEST, 'Only one notice is allowed!');
  }
  const result = await PopupNotice.create(data);
  return result;
};

export const getPopupNoticeService = async (query: Record<string, unknown>) => {
  const { isActive } = query;

  let queryParams = {};
  if (isActive !== undefined) {
    queryParams = { isActive: isActive === 'true' };
  }

  const result = await PopupNotice.findOne(queryParams);
  return result;
};

export const getSinglePopupNoticeService = async (id: string) => {
  const result = await PopupNotice.findById(id);
  return result;
};

export const updatePopupNoticeService = async (
  id: string,
  data: IPopupNotice,
) => {
  const isExist = await PopupNotice.findById(id);
  if (!isExist) {
    deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.NOT_FOUND, 'Notice not found !');
  }

  const result = await PopupNotice.findByIdAndUpdate(id, data, { new: true });
  if (result && data?.image) deleteFile(`./uploads/${isExist?.image}`);
  return result;
};

export const deletePopupNoticeService = async (id: string) => {
  const isExist = await PopupNotice.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notice not found !');
  }

  await PopupNotice.findByIdAndDelete(id);
  deleteFile(`./uploads/${isExist?.image}`);
  return true;
};
