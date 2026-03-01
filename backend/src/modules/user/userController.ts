import { catchAsync } from '../../utils/catchAsync';
import { deleteFile } from '../../utils/deleteFile';
import {
  addUserService,
  deleteUserService,
  getAllUserService,
  getSingleUserService,
  getUserCountService,
  updatePasswordService,
  updateProfileService,
  updateUserService,
} from './userService';

export const addUserController = catchAsync(async (req, res) => {
  const result = await addUserService(req.body);

  res.status(200).json({
    success: true,
    message: 'User add successfully',
    data: result,
  });
});

export const getAllUserController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllUserService(req.query);

  res.status(200).json({
    success: true,
    message: 'User get successfully',
    meta,
    data,
  });
});

export const getSingleUserController = catchAsync(async (req, res) => {
  const result = await getSingleUserService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User get successfully',
    data: result,
  });
});

export const updateUserController = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const result = await updateUserService(id, data);

  res.status(200).json({
    success: true,
    message: 'User update successfully',
    data: result,
  });
});

export const deleteUserController = catchAsync(async (req, res) => {
  const id = req.params.id;

  await deleteUserService(id, req.body.user);
  res.status(200).json({
    success: true,
    message: 'User delete successfully',
  });
});

export const updateProfileController = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const image: string | undefined = req?.file?.filename;
  const data = req.body;

  try {
    const newData = {
      ...data,
      profileUrl: image ? `/user/${image}` : undefined,
    };

    const result = await updateProfileService(id, newData);

    res.status(200).json({
      success: true,
      message: 'Profile update successfully',
      data: result,
    });
  } catch (error) {
    if (image) deleteFile(`./uploads/user/${image}`);
    next(error);
  }
});

export const updatePasswordController = catchAsync(async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  const result = await updatePasswordService(id, body);
  res.status(200).json({
    success: true,
    message: 'Password update successfully',
    data: result,
  });
});

export const getUserCountController = catchAsync(async (req, res) => {
  const result = await getUserCountService();
  res.status(200).json({
    success: true,
    message: 'User count fetched successfully',
    data: result,
  });
});
