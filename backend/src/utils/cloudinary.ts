import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { CloudinaryConfig } from '../modules/cloudinaryConfig/cloudinaryConfigModel';

type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto';

type CloudinaryTarget = {
  publicId: string;
  resourceType: CloudinaryResourceType;
};

export const configureCloudinary = async (requireActive = true) => {
  const config = await CloudinaryConfig.findOne({})
    .select('+apiSecret')
    .lean();

  if (
    !config?.cloudName ||
    !config?.apiKey ||
    !config?.apiSecret ||
    (requireActive && config.isActive === false)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cloudinary config is missing or inactive. Please configure it from admin dashboard.',
    );
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });

  return {
    folder: config.folder || 'foodie-cafe',
  };
};

export const getCloudinaryFolder = (rootFolder: string, uploadPath: string) =>
  [rootFolder, uploadPath]
    .filter(Boolean)
    .map((item) => item.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  options: UploadApiOptions,
) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

export const getCloudinaryTarget = (
  filePath?: string | null,
): CloudinaryTarget | null => {
  if (!filePath) return null;

  const url = filePath.match(/https?:\/\/[^\s]+/i)?.[0];
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const resourceType = parts[1] as CloudinaryResourceType | undefined;
    const uploadIndex = parts.indexOf('upload');

    if (!resourceType || uploadIndex === -1) return null;

    const pathParts = parts.slice(uploadIndex + 1);
    const publicIdParts = pathParts[0]?.match(/^v\d+$/)
      ? pathParts.slice(1)
      : pathParts;

    let publicId = decodeURIComponent(publicIdParts.join('/'));
    if (!publicId) return null;

    if (resourceType !== 'raw') {
      publicId = publicId.replace(/\.[^/.]+$/, '');
    }

    return {
      publicId,
      resourceType,
    };
  } catch {
    return null;
  }
};

export const deleteCloudinaryFile = async (filePath: string) => {
  const target = getCloudinaryTarget(filePath);
  if (!target) return false;

  await configureCloudinary(false);
  await cloudinary.uploader.destroy(target.publicId, {
    resource_type: target.resourceType,
    invalidate: true,
  });

  return true;
};
