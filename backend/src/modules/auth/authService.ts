import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/createToken';
import { User } from '../user/userModel';
import { ILoginUser } from './authInterface';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';

export const loginUserService = async (payload: ILoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  //checking if the password is correct
  const isMatch = await bcrypt.compare(payload?.password, user?.password);

  if (!isMatch)
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the client
  const jwtPayload = {
    _id: user?._id,
    email: user?.email,
    name: user?.name,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  return {
    accessToken,
  };
};
