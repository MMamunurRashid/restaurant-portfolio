import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import {
  configureCloudinary,
  getCloudinaryFolder,
  uploadBufferToCloudinary,
} from './cloudinary';

const sanitizePublicId = (fileName: string) =>
  fileName
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const buildPublicId = (originalName: string) => {
  const parsedName = path.parse(originalName).name;
  const cleanName = sanitizePublicId(parsedName) || 'file';

  return `${Date.now()}-${cleanName}`;
};

export const fileUploader = (uploadPath: string) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  const uploadAndConvert = async (req: any, res: any, next: any) => {
    try {
      const hasSingleFile = Boolean(req.file);
      const hasArrayFiles = Array.isArray(req.files) && req.files.length > 0;
      const hasFieldFiles =
        req.files &&
        !Array.isArray(req.files) &&
        Object.values(req.files).some(
          (fieldFiles) =>
            Array.isArray(fieldFiles) && fieldFiles.length > 0,
        );

      if (!hasSingleFile && !hasArrayFiles && !hasFieldFiles) {
        return next();
      }

      const config = await configureCloudinary();
      const folder = getCloudinaryFolder(config.folder, uploadPath);

      const processFile = async (file: Express.Multer.File) => {
        const isImage = file.mimetype.startsWith('image/');
        const isPdf = file.mimetype === 'application/pdf';
        const buffer = isImage
          ? await sharp(file.buffer).webp({ quality: 80 }).toBuffer()
          : file.buffer;

        const result = await uploadBufferToCloudinary(buffer, {
          folder,
          public_id: buildPublicId(file.originalname),
          resource_type: isImage ? 'image' : 'raw',
          ...(isImage ? { format: 'webp' } : {}),
        });

        return {
          ...file,
          buffer,
          filename: result.secure_url,
          path: result.secure_url,
          mimetype: isImage ? 'image/webp' : file.mimetype,
          public_id: result.public_id,
          resource_type: isPdf ? 'raw' : result.resource_type,
        };
      };

      if (req.file) {
        req.file = await processFile(req.file);
        return next();
      }

      if (Array.isArray(req.files)) {
        req.files = await Promise.all(req.files.map(processFile));
        return next();
      }

      if (req.files && Object.keys(req.files).length) {
        const files: Record<string, Express.Multer.File[]> = {};

        for (const fieldName in req.files) {
          const fieldFiles = req.files[fieldName];
          files[fieldName] = await Promise.all(fieldFiles.map(processFile));
        }

        req.files = files;
      }

      next();
    } catch (err) {
      next(err);
    }
  };

  return { upload, uploadAndConvert };
};
