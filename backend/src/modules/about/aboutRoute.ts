import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addAboutController,
  deleteAboutController,
  getAboutController,
  getSingleAboutController,
  updateAboutController,
} from './aboutController';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('about');

const uploader = upload.fields([{ name: 'image', maxCount: 1 }]);

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addAboutController,
);
Router.get('/', getAboutController);
Router.get('/:id', getSingleAboutController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateAboutController,
);
Router.delete('/delete/:id', deleteAboutController);

export const aboutRoute = Router;
