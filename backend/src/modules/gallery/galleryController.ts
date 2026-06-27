import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { deleteFile } from '../../utils/deleteFile';
import { getStoredFilePath } from '../../utils/filePath';
import {
  addGalleryService,
  deleteGalleryService,
  getAllGalleryService,
  getSingleGalleryService,
  getGalleryCountService,
  updateGalleryService,
} from './galleryService';

export const addGalleryController = catchAsync(async (req, res, next) => {
  const files = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  // payload may be sent as `data` field (stringified) when uploading
  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;

  try {
    // Map uploaded files (if any)
    const galleryFiles = files.gallery
      ? files.gallery.map((f: any) => getStoredFilePath(f.filename, 'gallery'))
      : [];

    // Build images array: combine any provided payload.images (or existingImages) with newly uploaded files
    const imagesFromPayload = Array.isArray(payload?.images)
      ? payload.images
      : Array.isArray(payload?.existingImages)
      ? payload.existingImages
      : [];

    const newImageTitles = Array.isArray(payload?.newImageTitles) ? payload.newImageTitles : [];

    const uploadedImages = galleryFiles.map((imgPath, idx) => ({ title: newImageTitles[idx] || '', image: imgPath }));

    const finalImages = [...imagesFromPayload, ...uploadedImages];

    const dataToCreate = {
      title: payload?.title,
      images: finalImages,
      isActive: payload?.isActive,
      order: payload?.order,
    };

    const result = await addGalleryService(dataToCreate);

    res.status(200).json({
      success: true,
      message: 'Gallery added successfully',
      data: result,
    });
  } catch (err) {
    // cleanup uploaded files if any error
    const galleryFiles = files.gallery ? files.gallery.map((f: any) => f.filename) : [];
    if (galleryFiles.length > 0) galleryFiles.forEach((f: string) => deleteFile(f));
    next(err);
  }
});

export const getAllGalleryController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllGalleryService(req.query);

  res.status(200).json({
    success: true,
    message: 'Galleries fetched successfully',
    meta,
    data,
  });
});

export const getSingleGalleryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleGalleryService(id);

  res.status(200).json({
    success: true,
    message: 'Gallery fetched successfully',
    data: result,
  });
});

export const updateGalleryController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const files = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;

  try {
    // existingImages expected to be an array of objects { title, image }
    const existingImages = Array.isArray(payload?.images)
      ? payload.images
      : Array.isArray(payload?.existingImages)
      ? payload.existingImages
      : [];

    // new uploaded files
    const newGalleryFiles = files.gallery
      ? files.gallery.map((f: any) => getStoredFilePath(f.filename, 'gallery'))
      : [];

    const newImageTitles = Array.isArray(payload?.newImageTitles) ? payload.newImageTitles : [];

    // combine: map new files to titles by index
    const uploadedImages = newGalleryFiles.map((imgPath, idx) => ({ title: newImageTitles[idx] || '', image: imgPath }));

    const finalImages = [...existingImages, ...uploadedImages];

    const dataToUpdate = {
      title: payload?.title,
      images: finalImages,
      isActive: payload?.isActive,
      order: payload?.order,
    };

    const result = await updateGalleryService(id, dataToUpdate);

    res.status(200).json({
      success: true,
      message: 'Gallery updated successfully',
      data: result,
    });

    // After success, remove any old files that were deleted by user
    if (result) {
      const isExist = await getSingleGalleryService(id);
      // isExist contains images BEFORE update; we should compute removed images earlier in service
      // but ensure any files specified for deletion are removed in service
    }
  } catch (err) {
    // cleanup newly uploaded files on error
    const newFiles = files.gallery ? files.gallery.map((f: any) => f.filename) : [];
    if (newFiles.length > 0) newFiles.forEach((f: string) => deleteFile(f));
    next(err as any);
  }
});

export const deleteGalleryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteGalleryService(id);

  res.status(200).json({
    success: true,
    message: 'Gallery deleted successfully',
  });
});

export const getGalleryCountController = catchAsync(async (req, res) => {
  const result = await getGalleryCountService();
  res.status(200).json({
    success: true,
    message: 'Gallery count fetched successfully',
    data: result,
  });
});
