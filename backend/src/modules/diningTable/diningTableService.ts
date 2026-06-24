import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builders/QueryBuilder';
import { Appointment } from '../appointment/appointmentModel';
import { IDiningTable } from './diningTableInterface';
import { DiningTable } from './diningTableModel';

export const addDiningTableService = async (data: IDiningTable) => {
  const result = await DiningTable.create({ ...data });
  return result;
};

export const getAllDiningTableService = async (
  query: Record<string, unknown>,
) => {
  const result = new QueryBuilder(DiningTable.find(), query)
    .search(['tableNumber', 'area', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  if (!query.sort) {
    result.modelQuery = result.modelQuery.sort('sortOrder tableNumber');
  }

  const meta = await result.countTotal();
  const data = await result.modelQuery;

  return { meta, data };
};

export const getSingleDiningTableService = async (id: string) => {
  const result = await DiningTable.findById(id);
  return result;
};

export const updateDiningTableService = async (
  id: string,
  data: Partial<IDiningTable>,
) => {
  const isExist = await DiningTable.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Table not found !');

  const result = await DiningTable.findByIdAndUpdate(
    id,
    { ...data },
    { new: true },
  );
  return result;
};

export const deleteDiningTableService = async (id: string) => {
  const isExist = await DiningTable.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Table not found !');

  const activeAssignment = await Appointment.findOne({
    assignedTable: id,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (activeAssignment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This table is assigned to an active reservation',
    );
  }

  await DiningTable.findByIdAndDelete(id);
  return true;
};

export const getDiningTableCountsService = async () => {
  const totalTables = await DiningTable.countDocuments();
  const activeTables = await DiningTable.countDocuments({ isActive: true });
  return { totalTables, activeTables };
};
