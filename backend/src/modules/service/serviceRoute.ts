import express, { NextFunction, Request, Response } from 'express';
import {
  createServiceController,
  deleteServiceController,
  getAllServiceController,
  getByIdServiceController,
  getBySlugServiceController,
  getServiceCountController,
  updateServiceActiveController,
  updateServiceController,
} from './serviceController';
const Router = express.Router();

import { fileUploader } from '../../utils/fileUploader';
const { upload, uploadAndConvert } = fileUploader('service');

const uploader = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery' },
  { name: 'icon', maxCount: 1 },
]);

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  createServiceController,
);
Router.get('/all', getAllServiceController);
Router.get('/count', getServiceCountController);
Router.get('/:id', getByIdServiceController);
Router.get('/slug/:slug', getBySlugServiceController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateServiceController,
);
Router.patch('/toggle-active/:id', updateServiceActiveController);
Router.delete('/delete/:id', deleteServiceController);

export const serviceRoute = Router;
