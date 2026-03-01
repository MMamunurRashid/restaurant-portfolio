import { catchAsync } from '../../utils/catchAsync';
import {
  addTeamCategoryService,
  deleteTeamCategoryService,
  getAllTeamCategoryService,
  getSingleTeamCategoryService,
  updateTeamCategoryService,
} from './teamCategoryService';

export const addTeamCategoryController = catchAsync(async (req, res) => {
  const result = await addTeamCategoryService(req.body);

  res.status(200).json({
    success: true,
    message: 'Team Category add successfully',
    data: result,
  });
});

export const getAllTeamCategoryController = catchAsync(async (req, res) => {
  const result = await getAllTeamCategoryService();

  res.status(200).json({
    success: true,
    message: 'Team Categories get successfully',
    data: result,
  });
});

export const getSingleTeamCategoryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleTeamCategoryService(id);

  res.status(200).json({
    success: true,
    message: 'Team Category get successfully',
    data: result,
  });
});

export const updateTeamCategoryController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await updateTeamCategoryService(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Team Category update successfully',
    data: result,
  });
});

export const deleteTeamCategoryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteTeamCategoryService(id);

  res.status(200).json({
    success: true,
    message: 'Team Category delete successfully',
  });
});
