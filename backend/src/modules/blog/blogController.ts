import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import {
  addBlogService,
  deleteBlogService,
  getAllBlogService,
  getBlogBySlugService,
  getBlogCountService,
  getSingleBlogService,
  toggleBlogStatusService,
  updateBlogService,
} from './blogService';
import { makeSlug } from '../../utils/makeSlug';

export const addBlogController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  if (!image) throw new AppError(httpStatus.NOT_FOUND, 'Image is required !');

  try {
    const data = {
      ...req.body,
      image: `/blog/${image}`,
      slug: makeSlug(req.body?.title),
    };

    const result = await addBlogService(data);

    res.status(200).json({
      success: true,
      message: 'Blog add successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/blog/${image}`);
    next(error);
  }
});

export const getAllBlogController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllBlogService(req.query);

  res.status(200).json({
    success: true,
    message: 'Blogs get successfully',
    meta,
    data,
  });
});

export const getSingleBlogController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleBlogService(id);

  res.status(200).json({
    success: true,
    message: 'Blog get successfully',
    data: result,
  });
});

export const getBlogBySlugController = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await getBlogBySlugService(slug);

  res.status(200).json({
    success: true,
    message: 'Blog get successfully',
    data: result,
  });
});

export const updateBlogController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  const id = req.params.id;

  try {
    const data = {
      ...req.body,
      image: image ? `/blog/${image}` : undefined,
      slug: makeSlug(req?.body?.title),
    };

    const result = await updateBlogService(id, data);

    res.status(200).json({
      success: true,
      message: 'Blog update successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/blog/${image}`);
    next(error);
  }
});

export const deleteBlogController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteBlogService(id);

  res.status(200).json({
    success: true,
    message: 'Blog delete successfully',
  });
});

export const toggleBlogStatusController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await toggleBlogStatusService(id);

  res.status(200).json({
    success: true,
    message: 'Blog status toggled successfully',
  });
});

export const getBlogCountController = catchAsync(async (req, res) => {
  const result = await getBlogCountService();
  res.status(200).json({
    success: true,
    message: 'Blog count fetched successfully',
    data: result,
  });
});
