import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import QueryBuilder from '../../builders/QueryBuilder';
import { IGallery } from './galleryInterface';
import { Gallery } from './galleryModel';

export const addGalleryService = async (data: IGallery) => {
  const result = await Gallery.create(data);
  return result;
};

export const getAllGalleryService = async (query: Record<string, unknown>) => {
  const result = new QueryBuilder(Gallery.find(), query)
    .search(['title'])
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

export const getSingleGalleryService = async (id: string) => {
  const result = await Gallery.findById(id);
  return result;
};

export const updateGalleryService = async (id: string, data: IGallery) => {
  const isExist = await Gallery.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Gallery not found !');

  // If images provided, remove deleted images from disk
  if (data?.images && Array.isArray(data.images)) {
    const newPaths = data.images.map((i) => i.image);
    const removed = isExist.images.filter((old: any) => !newPaths.includes(old.image));
    removed.forEach((img: any) => {
      if (img?.image) deleteFile(`./uploads/${img.image}`);
    });
  }

  const result = await Gallery.findByIdAndUpdate(id, { ...data }, { new: true });
  return result;
};

export const deleteGalleryService = async (id: string) => {
  const isExist = await Gallery.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Gallery not found !');

  await Gallery.findByIdAndDelete(id);

  // delete images from uploads folder
  isExist.images.forEach((img: any) => {
    if (img?.image) deleteFile(`./uploads/${img.image}`);
  });

  return true;
};

export const getGalleryCountService = async () => {
  const totalGalleries = await Gallery.countDocuments();
  return { totalGalleries };
};
