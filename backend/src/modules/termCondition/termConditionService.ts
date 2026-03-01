import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { ITermCondition } from './termConditionInterface';
import { TermCondition } from './termConditionModel';

export const addTermConditionService = async (data: ITermCondition) => {
  const isExist = await TermCondition.findOne();
  if (isExist)
    throw new AppError(httpStatus.BAD_REQUEST, 'Term Condition already exist');

  const result = await TermCondition.create(data);
  return result;
};

export const getTermConditionService = async () => {
  const result = await TermCondition.findOne();
  return result;
};

export const updateTermConditionService = async (
  id: string,
  data: ITermCondition,
) => {
  const isExist = await TermCondition.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Term Condition not found');

  const result = await TermCondition.findByIdAndUpdate(id, data, { new: true });
  return result;
};
