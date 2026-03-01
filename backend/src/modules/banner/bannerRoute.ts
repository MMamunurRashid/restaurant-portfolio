import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addBannerController,
  deleteBannerController,
  getAllBannerController,
  getSingleBannerController,
  updateBannerController,
} from './bannerController';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('banner');
const uploader = upload.single('image');

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addBannerController,
);
Router.get('/all', getAllBannerController);
Router.get('/:id', getSingleBannerController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateBannerController,
);
Router.delete('/delete/:id', deleteBannerController);

export const bannerRoute = Router;
