import { catchAsync } from '../../utils/catchAsync';
import {
  addGalleryService,
  deleteGalleryService,
  getAllGalleryService,
  getSingleGalleryService,
  getGalleryCountService,
  updateGalleryService,
} from './galleryService';

export const addGalleryController = catchAsync(async (req, res) => {
  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;

  const result = await addGalleryService(payload);

  res.status(200).json({
    success: true,
    message: 'Gallery added successfully',
    data: result,
  });
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

export const updateGalleryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;

  const result = await updateGalleryService(id, payload);

  res.status(200).json({
    success: true,
    message: 'Gallery updated successfully',
    data: result,
  });
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
