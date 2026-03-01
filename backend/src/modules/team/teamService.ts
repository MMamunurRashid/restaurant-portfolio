import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import QueryBuilder from '../../builders/QueryBuilder';
import { ITeam } from './teamInterface';
import { Team } from './teamModel';

export const addTeamService = async (data: ITeam) => {
  const result = await Team.create(data);
  return result;
};

export const getAllTeamService = async (query: Record<string, unknown>) => {
  const result = new QueryBuilder(Team.find().populate('category'), query)
    .search(['name', 'designation'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await result.countTotal();
  const data = await result.modelQuery;

  return {
    meta,
    data,
  };
};

export const getSingleTeamService = async (id: string) => {
  const result = await Team.findById(id);
  return result;
};

export const updateTeamService = async (id: string, data: ITeam) => {
  const isExist = await Team.findById(id);
  if (!isExist) {
    deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.NOT_FOUND, 'Team not found !');
  }

  const result = await Team.findByIdAndUpdate(id, data, { new: true });
  if (result && data?.image) deleteFile(`./uploads/${isExist?.image}`);
  return result;
};

export const deleteTeamService = async (id: string) => {
  const isExist = await Team.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Team not found !');
  }

  await Team.findByIdAndDelete(id);
  deleteFile(`./uploads/${isExist?.image}`);
  return true;
};

export const getTeamCountService = async () => {
  const totalTeams = await Team.countDocuments();
  return { totalTeams };
};
