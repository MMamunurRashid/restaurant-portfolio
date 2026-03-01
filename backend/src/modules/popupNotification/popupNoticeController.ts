import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import {
  addPopupNoticeService,
  deletePopupNoticeService,
  getPopupNoticeService,
  getSinglePopupNoticeService,
  updatePopupNoticeService,
} from './popupNoticeService';

export const addPopupNoticeController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  if (!image) throw new AppError(httpStatus.NOT_FOUND, 'Image is required !');

  const data = { ...req.body, image: `/notice/${image}` };

  try {
    const result = await addPopupNoticeService(data);

    res.status(200).json({
      success: true,
      message: 'Notice add successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/notice/${image}`);
    next(error);
  }
});

export const getPopupNoticeController = catchAsync(async (req, res) => {
  const result = await getPopupNoticeService(req.query);

  res.status(200).json({
    success: true,
    message: 'Notice get successfully',
    data: result,
  });
});

export const getSinglePopupNoticeController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSinglePopupNoticeService(id);

  res.status(200).json({
    success: true,
    message: 'Notice get successfully',
    data: result,
  });
});

export const updatePopupNoticeController = catchAsync(
  async (req, res, next) => {
    const image: string | undefined = req?.file?.filename;
    const id = req.params.id;

    const data = { ...req.body, image: image ? `/notice/${image}` : undefined };

    try {
      const result = await updatePopupNoticeService(id, data);

      res.status(200).json({
        success: true,
        message: 'Notice update successfully',
        data: result,
      });
    } catch (error) {
      if (image) deleteFile(`./uploads/notice/${image}`);
      next(error);
    }
  },
);

export const deletePopupNoticeController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deletePopupNoticeService(id);

  res.status(200).json({
    success: true,
    message: 'Notice delete successfully',
  });
});
