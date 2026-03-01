/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string): void => {
  const fullPath = path.join(process.cwd(), filePath);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${fullPath}`, err);
    } else {
      console.log(`File deleted: ${fullPath}`);
    }
  });
};
