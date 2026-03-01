import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IPrivacyPolicy } from './privacyPolicyInterface';
import { PrivacyPolicy } from './privacyPolicyModel';

export const addPrivacyPolicyService = async (data: IPrivacyPolicy) => {
  const isExist = await PrivacyPolicy.findOne();
  if (isExist)
    throw new AppError(httpStatus.BAD_REQUEST, 'Privacy Policy already exist');

  const result = await PrivacyPolicy.create(data);
  return result;
};

export const getPrivacyPolicyService = async () => {
  const result = await PrivacyPolicy.findOne();
  return result;
};

export const updatePrivacyPolicyService = async (
  id: string,
  data: IPrivacyPolicy,
) => {
  const isExist = await PrivacyPolicy.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Privacy Policy not found');

  const result = await PrivacyPolicy.findByIdAndUpdate(id, data, { new: true });
  return result;
};
