import { catchAsync } from '../../utils/catchAsync';
import {
  addDiningTableService,
  deleteDiningTableService,
  getAllDiningTableService,
  getDiningTableCountsService,
  getSingleDiningTableService,
  updateDiningTableService,
} from './diningTableService';

export const addDiningTableController = catchAsync(async (req, res) => {
  const result = await addDiningTableService(req.body);

  res.status(200).json({
    success: true,
    message: 'Dining table added successfully',
    data: result,
  });
});

export const getAllDiningTableController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllDiningTableService(req.query);

  res.status(200).json({
    success: true,
    message: 'Dining tables fetched successfully',
    meta,
    data,
  });
});

export const getSingleDiningTableController = catchAsync(async (req, res) => {
  const result = await getSingleDiningTableService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Dining table fetched successfully',
    data: result,
  });
});

export const updateDiningTableController = catchAsync(async (req, res) => {
  const result = await updateDiningTableService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Dining table updated successfully',
    data: result,
  });
});

export const deleteDiningTableController = catchAsync(async (req, res) => {
  await deleteDiningTableService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Dining table deleted successfully',
  });
});

export const getDiningTableCountsController = catchAsync(async (req, res) => {
  const result = await getDiningTableCountsService();

  res.status(200).json({
    success: true,
    message: 'Dining table counts fetched successfully',
    data: result,
  });
});
