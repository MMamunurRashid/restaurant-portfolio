import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import QueryBuilder from '../../builders/QueryBuilder';
import { IGallery } from './galleryInterface';
import { Gallery } from './galleryModel';

const normalizeGalleryImagePath = (image?: string) => {
  if (!image) return image;
  if (/^(https?:|data:)/i.test(image)) return image;
  return image.startsWith('/') ? image : '/' + image.replace(/^\/+/, '');
};

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
  // If images provided, normalize incoming paths and remove deleted images from disk
  let removed: any[] = [];
  if (data?.images && Array.isArray(data.images)) {
    // Ensure stored image paths use a leading slash (e.g. /gallery/filename)
    const normalizedImages = data.images.map((i: any) => ({
      ...i,
      image: normalizeGalleryImagePath(i?.image),
    }));

    // Compute removed images by comparing normalized incoming paths with existing ones
    const newPaths = normalizedImages.map((i: any) => i.image);
    removed = isExist.images.filter((old: any) => !newPaths.includes(old.image));

    // Replace incoming images with normalized versions for DB update
    // (ensures consistent storage format)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.images = normalizedImages;
  }

  const result = await Gallery.findByIdAndUpdate(id, { ...data }, { new: true });

  // After successful DB update, delete any removed files from uploads folder
  if (removed.length > 0) {
    removed.forEach((img: any) => {
      if (img?.image) deleteFile(img.image);
    });
  }

  return result;
};

export const deleteGalleryService = async (id: string) => {
  const isExist = await Gallery.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Gallery not found !');

  await Gallery.findByIdAndDelete(id);

  // delete images from uploads folder (normalize path)
  isExist.images.forEach((img: any) => {
    if (img?.image) deleteFile(img.image);
  });

  return true;
};

export const getGalleryCountService = async () => {
  const totalGalleries = await Gallery.countDocuments();
  return { totalGalleries };
};
