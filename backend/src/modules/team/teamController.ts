import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import {
  addTeamService,
  deleteTeamService,
  getAllTeamService,
  getSingleTeamService,
  getTeamCountService,
  updateTeamService,
} from './teamService';

export const addTeamController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  if (!image) throw new AppError(httpStatus.NOT_FOUND, 'Image is required !');

  try {
    const data = {
      ...req.body,
      image: `/team/${image}`,
    };

    const result = await addTeamService(data);

    res.status(200).json({
      success: true,
      message: 'Team added successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/team/${image}`);
    next(error);
  }
});

export const getAllTeamController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllTeamService(req.query);

  res.status(200).json({
    success: true,
    message: 'Teams get successfully',
    meta,
    data,
  });
});

export const getSingleTeamController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleTeamService(id);

  res.status(200).json({
    success: true,
    message: 'Team get successfully',
    data: result,
  });
});

export const updateTeamController = catchAsync(async (req, res, next) => {
  const image: string | undefined = req?.file?.filename;
  const id = req.params.id;

  try {
    const data = {
      ...req.body,
      image: image ? `/team/${image}` : undefined,
    };

    const result = await updateTeamService(id, data);

    res.status(200).json({
      success: true,
      message: 'Team update successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/team/${image}`);
    next(error);
  }
});

export const deleteTeamController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteTeamService(id);

  res.status(200).json({
    success: true,
    message: 'Team delete successfully',
  });
});

export const getTeamCountController = catchAsync(async (req, res) => {
  const result = await getTeamCountService();
  res.status(200).json({
    success: true,
    message: 'Team count fetched successfully',
    data: result,
  });
});
