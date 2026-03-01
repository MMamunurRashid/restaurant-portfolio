import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import {
  addAboutService,
  getAboutService,
  getSingleAboutService,
  updateAboutService,
  deleteAboutService,
} from './aboutService';

export const addAboutController = catchAsync(async (req, res, next) => {
  const files = (req.files as { [key: string]: Express.Multer.File[] }) || {};

  const image = files.image?.[0]?.filename || null;

  if (!image) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image is required !');
  }

  try {
    const data = {
      ...req.body,
      image: `/about/${image}`,
    };

    const result = await addAboutService(data);

    res.status(200).json({
      success: true,
      message: 'About add successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/about/${image}`);
    next(error);
  }
});

export const getAboutController = catchAsync(async (req, res) => {
  const result = await getAboutService();

  res.status(200).json({
    success: true,
    message: 'About get successfully',
    data: result,
  });
});

export const getSingleAboutController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleAboutService(id);

  res.status(200).json({
    success: true,
    message: 'About get successfully',
    data: result,
  });
});

export const updateAboutController = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const files = (req.files as { [key: string]: Express.Multer.File[] }) || {};

  const image = files.image?.[0]?.filename || null;

  try {
    const data = {
      ...req.body,
      image: image ? `/about/${image}` : undefined,
    };

    const result = await updateAboutService(id, data);

    res.status(200).json({
      success: true,
      message: 'About update successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/about/${image}`);
    next(error);
  }
});

export const deleteAboutController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteAboutService(id);

  res.status(200).json({
    success: true,
    message: 'About delete successfully',
  });
});
