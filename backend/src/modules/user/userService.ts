import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IUser } from './userInterface';
import { User } from './userModel';
import bcrypt from 'bcrypt';
import QueryBuilder from '../../builders/QueryBuilder';
import { deleteFile } from '../../utils/deleteFile';

export const addUserService = async (data: IUser) => {
  const result = await User.create(data);
  return result;
};

export const getAllUserService = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await userQuery.countTotal();
  const data = await userQuery.modelQuery;

  return {
    meta,
    data,
  };
};

export const getSingleUserService = async (id: string) => {
  const result = await User.findOne({ _id: id });
  return result;
};

export const updateUserService = async (id: string, data: IUser) => {
  const isExist = await User.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const result = await User.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const deleteUserService = async (id: string, user: string) => {
  const isExist = await User.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  if (isExist?.role === 'superAdmin')
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You cannot delete Super Admin user!',
    );

  const result = await User.findByIdAndDelete(id);
  return result;
};

export const updateProfileService = async (id: string, data: IUser) => {
  const isExist = await User.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const result = await User.findByIdAndUpdate(id, data, { new: true });
  if (result && isExist?.profileUrl && data?.profileUrl)
    deleteFile(`./uploads/${isExist?.profileUrl}`);

  return result;
};

export const updatePasswordService = async (
  id: string,
  data: { oldPassword: string; newPassword: string },
) => {
  const isExist = await User.findById(id).select('+password');
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  const { oldPassword, newPassword } = data;
  const isMatch = await bcrypt.compare(oldPassword, isExist?.password);
  if (!isMatch)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password do not matched');

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  const newData = { password: hashPassword };

  const result = await User.findByIdAndUpdate(id, newData, { new: true });
  return result;
};

export const getUserCountService = async () => {
  const totalUsers = await User.countDocuments();
  return { totalUsers };
};
