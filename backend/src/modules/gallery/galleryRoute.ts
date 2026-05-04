import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  addGalleryController,
  deleteGalleryController,
  getAllGalleryController,
  getGalleryCountController,
  getSingleGalleryController,
  updateGalleryController,
} from './galleryController';
import { galleryValidation, updateGalleryValidation } from './galleryValidation';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('gallery');

const uploader = upload.fields([{ name: 'gallery' }]);

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  verifyValidate(galleryValidation),
  addGalleryController,
);

Router.get('/all', getAllGalleryController);
Router.get('/counts', getGalleryCountController);
Router.get('/:id', getSingleGalleryController);

Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  verifyValidate(updateGalleryValidation),
  updateGalleryController,
);

Router.delete('/delete/:id', deleteGalleryController);

export const galleryRoute = Router;
