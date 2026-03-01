import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addGeneralSettingController,
  getGeneralSettingController,
  getSingleGeneralSettingController,
  updateGeneralSettingController,
} from './generalSettingController';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('generalSetting');
const uploader = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'footerImage', maxCount: 1 },
]);

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addGeneralSettingController,
);
Router.get('/', getGeneralSettingController);
Router.get('/:id', getSingleGeneralSettingController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateGeneralSettingController,
);

export const generalSettingRoute = Router;
