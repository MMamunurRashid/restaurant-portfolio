import { catchAsync } from '../../utils/catchAsync';
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

export const addPackageController = catchAsync(async (req, res) => {
  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;

  const pack =  {...payload, slug: makeSlug(payload.title)};
  const result = await addPackageService(pack);

  res.status(200).json({
    success: true,
    message: 'Package add successfully',
    data: result,
  });
});

export const getAllPackageController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllPackageService(req.query);

  res.status(200).json({
    success: true,
    message: 'Packages get successfully',
    meta,
    data,
  });
});

export const getSinglePackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSinglePackageService(id);

  res.status(200).json({
    success: true,
    message: 'Package get successfully',
    data: result,
  });
});

export const updatePackageController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const payload = req.body && req.body.data ? (typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data) : req.body;
  const pack = {...payload, slug: makeSlug(payload.title)};
  const result = await updatePackageService(id, pack);

  res.status(200).json({
    success: true,
    message: 'Package update successfully',
    data: result,
  });
});

export const deletePackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deletePackageService(id);

  res.status(200).json({
    success: true,
    message: 'Package delete successfully',
  });
});

export const togglePopularPackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await togglePopularPackageService(id);
  res.status(200).json({
    success: true,
    message: 'Package popularity toggled successfully',
    data: result,
  });
});

export const toggleFeaturedPackageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await toggleFeaturedPackageService(id);
  res.status(200).json({
    success: true,
    message: 'Package featured status toggled successfully',
    data: result,
  });
});

export const getPackageCountsController = catchAsync(async (req, res) => {
  const result = await getPackageCountsService();

  res.status(200).json({
    success: true,
    message: 'Package counts fetched successfully',
    data: result,
  });
});
