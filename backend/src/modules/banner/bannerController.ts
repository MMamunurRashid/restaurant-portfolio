import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import {
  addBannerService,
  deleteBannerService,
  getAllBannerService,
  getSingleBannerService,
  updateBannerService,
} from './bannerService';

export const addBannerController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  if (!image) throw new AppError(httpStatus.NOT_FOUND, 'Image is required !');

  try {
    const data = { ...req.body, image: `/banner/${image}` };
    const result = await addBannerService(data);

    res.status(200).json({
      success: true,
      message: 'Banner add successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/banner/${image}`);
    next(error);
  }
});

export const getAllBannerController = catchAsync(async (req, res) => {
  const result = await getAllBannerService();

  res.status(200).json({
    success: true,
    message: 'Banners get successfully',
    data: result,
  });
});

export const getSingleBannerController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleBannerService(id);

  res.status(200).json({
    success: true,
    message: 'Banner get successfully',
    data: result,
  });
});

export const updateBannerController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  const id = req.params.id;

  try {
    const data = { ...req.body, image: image ? `/banner/${image}` : undefined };
    const result = await updateBannerService(id, data);

    res.status(200).json({
      success: true,
      message: 'Banner update successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/banner/${image}`);
    next(error);
  }
});

export const deleteBannerController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteBannerService(id);

  res.status(200).json({
    success: true,
    message: 'Banner delete successfully',
  });
});
