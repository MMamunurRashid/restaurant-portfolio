import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addCampaignController,
  deleteCampaignController,
  getCampaignController,
  getSingleCampaignController,
  updateCampaignController,
} from './campaignController';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('campaign');
const uploader = upload.fields([{ name: 'image', maxCount: 1 }]);

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addCampaignController,
);
Router.get('/', getCampaignController);
Router.get('/:id', getSingleCampaignController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateCampaignController,
);
Router.delete('/delete/:id', deleteCampaignController);

export const campaignRoute = Router;
