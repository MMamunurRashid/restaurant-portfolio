import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IPackage } from './packageInterface';
import { Package } from './packageModel';
import QueryBuilder from '../../builders/QueryBuilder';
import { deleteFile } from '../../utils/deleteFile';

export const addPackageService = async (data: IPackage) => {
  const result = await Package.create({ ...data });
  return result;
};

export const getAllPackageService = async (query: Record<string, unknown>) => {
  const result = new QueryBuilder(Package.find(), query)
    .search(['title', 'services', 'description'])
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

export const getSinglePackageService = async (id: string) => {
  const result = await Package.findById(id);
  return result;
};

export const updatePackageService = async (id: string, data: IPackage) => {
  const isExist = await Package.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Package not found !');

  const result = await Package.findByIdAndUpdate(
    id,
    { ...data },
    { new: true },
  );

  if (result && data?.thumbnail && isExist?.thumbnail) {
    deleteFile(`./uploads${isExist.thumbnail}`);
  }

  return result;
};

export const deletePackageService = async (id: string) => {
  const isExist = await Package.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Package not found !');

  await Package.findByIdAndDelete(id);
  if (isExist?.thumbnail) {
    deleteFile(`./uploads${isExist.thumbnail}`);
  }
  return true;
};

// toggle popular package
export const togglePopularPackageService = async (id: string) => {
  const isExist = await Package.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Package not found !');
  isExist.isPopular = !isExist.isPopular;
  const result = await isExist.save();
  return result;
};

// toggle featured package
export const toggleFeaturedPackageService = async (id: string) => {
  const isExist = await Package.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Package not found !');
  isExist.isFeatured = !isExist.isFeatured;
  const result = await isExist.save();
  return result;
};


export const getPackageCountsService = async () => {
  const totalPackages = await Package.countDocuments();
  const featuredPackages = await Package.countDocuments({ isFeatured: true });
  return { totalPackages, featuredPackages };
};
