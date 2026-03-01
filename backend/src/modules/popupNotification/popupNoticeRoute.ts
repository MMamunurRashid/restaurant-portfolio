import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addPopupNoticeController,
  deletePopupNoticeController,
  getPopupNoticeController,
  getSinglePopupNoticeController,
  updatePopupNoticeController,
} from './popupNoticeController';
import { fileUploader } from '../../utils/fileUploader';
const { upload, uploadAndConvert } = fileUploader('notice');
const uploader = upload.single('image');

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addPopupNoticeController,
);
Router.get('/', getPopupNoticeController);
Router.get('/:id', getSinglePopupNoticeController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updatePopupNoticeController,
);
Router.delete('/delete/:id', deletePopupNoticeController);

export const popupNoticeRoute = Router;
