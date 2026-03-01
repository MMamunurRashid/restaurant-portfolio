import { catchAsync } from '../../utils/catchAsync';
import { loginUserService } from './authService';
import httpStatus from 'http-status';

export const loginUserController = catchAsync(async (req, res) => {
  const result = await loginUserService(req.body);
  const { accessToken } = result;

  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
    },
  });
});
