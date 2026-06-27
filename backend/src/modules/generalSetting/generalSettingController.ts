import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { getStoredFilePath } from '../../utils/filePath';
import {
  addGeneralSettingService,
  deleteGeneralSettingService,
  getGeneralSettingService,
  getSingleGeneralSettingService,
  updateGeneralSettingService,
} from './generalSettingService';

export const addGeneralSettingController = catchAsync(
  async (req, res, next) => {
    const files = (req.files as { [key: string]: Express.Multer.File[] }) || {};

    const logo = files.logo?.[0]?.filename || null;
    const favicon = files.favicon?.[0]?.filename || null;
    const footerImage = files.footerImage?.[0]?.filename || null;

    if (!logo) throw new AppError(httpStatus.BAD_REQUEST, 'Logo is required !');

    try {
      const data = {
        ...req.body,
        logo: getStoredFilePath(logo, 'generalSetting'),
        favicon: favicon
          ? getStoredFilePath(favicon, 'generalSetting')
          : undefined,
        footerImage: footerImage
          ? getStoredFilePath(footerImage, 'generalSetting')
          : undefined,
      };

      const result = await addGeneralSettingService(data);

      res.status(200).json({
        success: true,
        message: 'General setting add successfully',
        data: result,
      });
    } catch (error) {
      if (logo) deleteFile(logo);
      if (favicon) deleteFile(favicon);
      if (footerImage) deleteFile(footerImage);
      next(error);
    }
  },
);

export const getGeneralSettingController = catchAsync(async (req, res) => {
  const result = await getGeneralSettingService();

  res.status(200).json({
    success: true,
    message: 'General setting get successfully',
    data: result,
  });
});

export const getSingleGeneralSettingController = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await getSingleGeneralSettingService(id);

    res.status(200).json({
      success: true,
      message: 'General setting get successfully',
      data: result,
    });
  },
);

export const updateGeneralSettingController = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;

    const files = (req.files as { [key: string]: Express.Multer.File[] }) || {};

    const logo = files.logo?.[0]?.filename || null;
    const favicon = files.favicon?.[0]?.filename || null;
    const footerImage = files.footerImage?.[0]?.filename || null;

    try {
      const data = {
        ...req.body,
        logo: logo ? getStoredFilePath(logo, 'generalSetting') : undefined,
        favicon: favicon
          ? getStoredFilePath(favicon, 'generalSetting')
          : undefined,
        footerImage: footerImage
          ? getStoredFilePath(footerImage, 'generalSetting')
          : undefined,
      };

      const result = await updateGeneralSettingService(id, data);

      res.status(200).json({
        success: true,
        message: 'General setting update successfully',
        data: result,
      });
    } catch (error) {
      if (logo) deleteFile(logo);
      if (favicon) deleteFile(favicon);
      if (footerImage) deleteFile(footerImage);
      next(error);
    }
  },
);

export const deleteGeneralSettingController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteGeneralSettingService(id);

  res.status(200).json({
    success: true,
    message: 'General setting delete successfully',
  });
});
