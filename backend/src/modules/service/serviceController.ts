import httpStatus from 'http-status';
import {
  createServiceService,
  deleteServiceService,
  getAllServiceService,
  getByIdServiceService,
  getBySlugServiceService,
  getServiceCountService,
  updateServiceActiveService,
  updateServiceService,
} from './serviceService';
import { catchAsync } from '../../utils/catchAsync';
import { makeSlug } from '../../utils/makeSlug';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { Service } from './serviceModel';

export const createServiceController = catchAsync(async (req, res, next) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const thumbnail = files.thumbnail[0].filename;
  const icon = files?.icon ? files.icon[0].filename : undefined;
  const galleries = files.gallery ? files.gallery.map((f) => f.filename) : [];

  try {
    const { title } = req.body;

    const Service = {
      ...req.body,
      thumbnail: `/service/${thumbnail}`,
      icon: icon ? `/service/${icon}` : undefined,
      galleries:
        galleries?.length > 0
          ? galleries.map((gallery: string) => `/service/${gallery}`)
          : [],
      slug: makeSlug(title),
    };

    const result = await createServiceService(Service);

    res.status(200).json({
      success: true,
      message: 'Service add successfully',
      data: result,
    });
  } catch (error) {
    next(error);
    if (thumbnail) deleteFile(`./uploads/service/${thumbnail}`);
    if (icon) deleteFile(`./uploads/service/${icon}`);
    if (galleries?.length > 0) {
      galleries.forEach((gallery: string) => {
        deleteFile(`./uploads/service/${gallery}`);
      });
    }
  }
});

export const getAllServiceController = catchAsync(async (req, res) => {
  const { meta, data } = await getAllServiceService(req.query);

  res.status(200).json({
    success: true,
    message: 'Service get successfully',
    meta,
    data,
  });
});

export const getByIdServiceController = catchAsync(async (req, res) => {
  const result = await getByIdServiceService(req.params.id);
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Service not found');

  res.status(200).json({
    success: true,
    message: 'Service get successfully',
    data: result,
  });
});

export const getBySlugServiceController = catchAsync(async (req, res) => {
  const result = await getBySlugServiceService(req.params.slug);
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'Service not found');

  res.status(200).json({
    success: true,
    message: 'Service get successfully',
    data: result,
  });
});

export const updateServiceController = catchAsync(async (req, res, next) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // 1. New Files handle kora
  const thumbnailFile = files?.thumbnail ? files?.thumbnail[0].filename : null;
  const iconFile = files?.icon ? files.icon[0].filename : null;
  const newGalleryFiles = files?.gallery
    ? files.gallery.map((f) => f.filename)
    : [];

  try {
    const isExits = await Service.findById(req.params.id);
    if (!isExits) {
      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach((f) => deleteFile(`./uploads/service/${f}`));
      }
      if (thumbnailFile) {
        deleteFile(`./uploads/service/${thumbnailFile}`);
      }
      if (iconFile) {
        deleteFile(`./uploads/service/${iconFile}`);
      }
      throw new AppError(httpStatus.NOT_FOUND, 'Service not found');
    }

    const bodyData = req.body;
    const existingGalleries = bodyData?.existingGalleries || [];

    // 2. Thumbnail Logic
    const updatedThumbnail = thumbnailFile
      ? `/service/${thumbnailFile}`
      : isExits?.thumbnail;

    const updatedIcon = iconFile ? `/service/${iconFile}` : isExits?.icon;

    // 3. Galleries Logic
    // Prothome frontend theke asha 'existingGalleries' gulo rakhbo (ja user delete kore nai)
    let finalGalleries: string[] = [...existingGalleries];

    // Tarpor notun upload kora chobi gulo add korbo
    if (newGalleryFiles.length > 0) {
      const newImages = newGalleryFiles.map(
        (filename) => `/service/${filename}`,
      );
      finalGalleries = [...finalGalleries, ...newImages];
    }

    // 4. Update Object Prepare
    const ServiceUpdateData = {
      ...bodyData,
      slug: makeSlug(bodyData?.title),
      thumbnail: updatedThumbnail,
      icon: updatedIcon,
      galleries: finalGalleries,
    };

    const result = await updateServiceService(req.params.id, ServiceUpdateData);

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: result,
    });

    // 5. File System theke purono files delete kora (Success hobar por)
    if (result) {
      // Thumbnail delete
      if (thumbnailFile && isExits?.thumbnail) {
        deleteFile(`./uploads${isExits.thumbnail}`);
      }

      // icon delete
      if (iconFile && isExits?.icon) {
        deleteFile(`./uploads${isExits.icon}`);
      }

      // Gallery images delete (database-e chilo kintu final list-e nai)
      const imagesToDelete = isExits?.galleries?.filter(
        (oldImg: string) => !existingGalleries.includes(oldImg),
      );

      imagesToDelete?.forEach((image: string) => {
        deleteFile(`./uploads${image}`);
      });
    }
  } catch (error) {
    // Error hole notun upload kora file gulo delete kore dewa
    if (newGalleryFiles.length > 0) {
      newGalleryFiles.forEach((f) => deleteFile(`./uploads/service/${f}`));
    }
    if (thumbnailFile) {
      deleteFile(`./uploads/service/${thumbnailFile}`);
    }
    if (iconFile) {
      deleteFile(`./uploads/service/${iconFile}`);
    }
    next(error);
  }
});

export const deleteServiceController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteServiceService(id);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
  });
});

export const updateServiceActiveController = catchAsync(async (req, res) => {
  const result = await updateServiceActiveService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service active status update successfully',
    data: result,
  });
});

export const getServiceCountController = catchAsync(async (req, res) => {
  const result = await getServiceCountService();

  res.status(200).json({
    success: true,
    message: 'Service count fetched successfully',
    data: result,
  });
});
