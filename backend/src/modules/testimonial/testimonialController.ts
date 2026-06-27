import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { getStoredFilePath } from '../../utils/filePath';
import {
  addTestimonialService,
  deleteTestimonialService,
  getAllTestimonialService,
  getSingleTestimonialService,
  updateTestimonialService,
} from './testimonialService';

export const addTestimonialController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  if (!image) throw new AppError(httpStatus.NOT_FOUND, 'Image is required !');

  try {
    const data = {
      ...req.body,
      image: getStoredFilePath(image, 'testimonial'),
    };
    const result = await addTestimonialService(data);

    res.status(200).json({
      success: true,
      message: 'Testimonial add successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(image);
    next(error);
  }
});

export const getAllTestimonialController = catchAsync(async (req, res) => {
  const result = await getAllTestimonialService();

  res.status(200).json({
    success: true,
    message: 'Testimonials get successfully',
    data: result,
  });
});

export const getSingleTestimonialController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleTestimonialService(id);

  res.status(200).json({
    success: true,
    message: 'Testimonial get successfully',
    data: result,
  });
});

export const updateTestimonialController = catchAsync(
  async (req, res, next) => {
    const image: string | undefined = req?.file?.filename;
    const id = req.params.id;

    try {
      const data = {
        ...req.body,
        image: image ? getStoredFilePath(image, 'testimonial') : undefined,
      };
      const result = await updateTestimonialService(id, data);

      res.status(200).json({
        success: true,
        message: 'Testimonial update successfully',
        data: result,
      });
    } catch (error) {
      if (image) deleteFile(image);
      next(error);
    }
  },
);

export const deleteTestimonialController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteTestimonialService(id);

  res.status(200).json({
    success: true,
    message: 'Testimonial delete successfully',
  });
});
