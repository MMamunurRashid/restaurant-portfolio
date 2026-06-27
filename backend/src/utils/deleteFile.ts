/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { deleteCloudinaryFile, getCloudinaryTarget } from './cloudinary';

export const deleteFile = (filePath: string): void => {
  if (!filePath) return;

  if (getCloudinaryTarget(filePath)) {
    void deleteCloudinaryFile(filePath).catch((err) => {
      console.error(`Error deleting Cloudinary file: ${filePath}`, err);
    });
    return;
  }

  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${fullPath}`, err);
    } else {
      console.log(`File deleted: ${fullPath}`);
    }
  });
};
