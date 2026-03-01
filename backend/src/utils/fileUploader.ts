import multer from 'multer';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const fileUploader = (uploadPath: string) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  const uploadAndConvert = async (req: any, res: any, next: any) => {
    try {
      const fullPath = path.join(process.cwd(), 'uploads', uploadPath);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      // Logic for Processing a single file or multiple files
      const processFile = async (file: any) => {
        const isPdf = file.mimetype === 'application/pdf';
        const fileExt = isPdf ? '.pdf' : '.webp';
        const fileName =
          Date.now() + '-' + path.parse(file.originalname).name + fileExt;
        const outputPath = path.join(fullPath, fileName);

        if (isPdf) {
          // 🔹 PDF hole Sharp bypass kore sorasori write korbe
          fs.writeFileSync(outputPath, file.buffer);
        } else {
          // 🔹 Image hole Sharp diye convert korbe
          await sharp(file.buffer).webp({ quality: 80 }).toFile(outputPath);
        }

        return {
          ...file,
          filename: fileName,
          path: outputPath,
          mimetype: isPdf ? 'application/pdf' : 'image/webp',
        };
      };

      // 🔹 Case 1: single()
      if (req.file) {
        req.file = await processFile(req.file);
        return next();
      }

      // 🔹 Case 2: fields() / array()
      if (req.files && Object.keys(req.files).length) {
        const files: any = {};

        for (const fieldName in req.files) {
          const fieldFiles = req.files[fieldName];
          files[fieldName] = [];

          for (const file of fieldFiles) {
            const processedFile = await processFile(file);
            files[fieldName].push(processedFile);
          }
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
