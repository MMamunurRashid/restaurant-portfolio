import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { makeSlug } from '../../utils/makeSlug';
import { ITeamCategory } from './teamCategoryInterface';
import { TeamCategory } from './teamCategoryModel';

export const addTeamCategoryService = async (data: ITeamCategory) => {
  const result = await TeamCategory.create({
    ...data,
    slug: makeSlug(data?.name),
  });
  return result;
};

export const getAllTeamCategoryService = async () => {
  const result = await TeamCategory.find({});
  return result;
};

export const getSingleTeamCategoryService = async (id: string) => {
  const result = await TeamCategory.findById(id);
  return result;
};

export const updateTeamCategoryService = async (
  id: string,
  data: ITeamCategory,
) => {
  const isExist = await TeamCategory.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Team Category not found !');

  const result = await TeamCategory.findByIdAndUpdate(
    id,
    {
      ...data,
      slug: makeSlug(data?.name),
    },
    { new: true },
  );
  return result;
};

export const deleteTeamCategoryService = async (id: string) => {
  const isExist = await TeamCategory.findById(id);
  if (!isExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Team Category not found !');

  await TeamCategory.findByIdAndDelete(id);
  return true;
};
