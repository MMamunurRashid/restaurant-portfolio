import { catchAsync } from '../../utils/catchAsync';
import { deleteFile } from '../../utils/deleteFile';
import { getStoredFilePath } from '../../utils/filePath';
import { makeSlug } from '../../utils/makeSlug';
import {
  addPackageService,
  deletePackageService,
  getAllPackageService,
  getPackageCountsService,
  getSinglePackageService,
  toggleFeaturedPackageService,
  togglePopularPackageService,
  updatePackageService,
} from './packageService';

export const addPackageController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;

  try {
    const pack =  {
      ...payload,
      slug: makeSlug(payload.title),
      thumbnail: image ? getStoredFilePath(image, 'packages') : undefined,
    };
    const result = await addPackageService(pack);

    res.status(200).json({
      success: true,
      message: 'Dining package added successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(image);
    next(error);
  }
});

export const getAllPackageController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllPackageService(req.query);

  res.status(200).json({
    success: true,
    message: 'Dining packages fetched successfully',
    meta,
    data,
  });
});

export const getSinglePackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSinglePackageService(id);

  res.status(200).json({
    success: true,
    message: 'Dining package fetched successfully',
    data: result,
  });
});

export const updatePackageController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const image: string | undefined = req?.file?.filename;

  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;
  try {
    const pack = {
      ...payload,
      slug: makeSlug(payload.title),
      ...(image ? { thumbnail: getStoredFilePath(image, 'packages') } : {}),
    };
    const result = await updatePackageService(id, pack);

    res.status(200).json({
      success: true,
      message: 'Dining package updated successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(image);
    next(error);
  }
});

export const deletePackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deletePackageService(id);

  res.status(200).json({
    success: true,
    message: 'Dining package deleted successfully',
  });
});

export const togglePopularPackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await togglePopularPackageService(id);
  res.status(200).json({
    success: true,
    message: 'Dining package popularity toggled successfully',
    data: result,
  });
});

export const toggleFeaturedPackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await toggleFeaturedPackageService(id);
  res.status(200).json({
    success: true,
    message: 'Dining package featured status toggled successfully',
    data: result,
  });
});

export const getPackageCountsController = catchAsync(async (req, res) => {
  const result = await getPackageCountsService();

  res.status(200).json({
    success: true,
    message: 'Dining package counts fetched successfully',
    data: result,
  });
});
