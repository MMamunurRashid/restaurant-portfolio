import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { getStoredFilePath } from '../../utils/filePath';
import {
  addCampaignService,
  getCampaignService,
  getSingleCampaignService,
  updateCampaignService,
  deleteCampaignService,
} from './campaignService';

export const addCampaignController = catchAsync(async (req, res, next) => {
  const files = (req.files as { [key: string]: Express.Multer.File[] }) || {};

  const image = files.image?.[0]?.filename || null;

  if (!image) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image is required !');
  }

  try {
    const data = {
      ...req.body,
      image: getStoredFilePath(image, 'campaign'),
    };

    const result = await addCampaignService(data);

    res.status(200).json({
      success: true,
      message: 'Campaign add successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(image);
    next(error);
  }
});

export const getCampaignController = catchAsync(async (req, res) => {
  const result = await getCampaignService();

  res.status(200).json({
    success: true,
    message: 'Campaign get successfully',
    data: result,
  });
});

export const getSingleCampaignController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleCampaignService(id);

  res.status(200).json({
    success: true,
    message: 'Campaign get successfully',
    data: result,
  });
});

export const updateCampaignController = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const files = (req.files as { [key: string]: Express.Multer.File[] }) || {};

  const image = files.image?.[0]?.filename || null;

  try {
    const data = {
      ...req.body,
      image: image ? getStoredFilePath(image, 'campaign') : undefined,
    };

    const result = await updateCampaignService(id, data);

    res.status(200).json({
      success: true,
      message: 'Campaign update successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(image);
    next(error);
  }
});

export const deleteCampaignController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteCampaignService(id);

  res.status(200).json({
    success: true,
    message: 'Campaign delete successfully',
  });
});
