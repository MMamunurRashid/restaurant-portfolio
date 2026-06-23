import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  addPackageController,
  deletePackageController,
  getAllPackageController,
  getPackageCountsController,
  getSinglePackageController,  
  toggleFeaturedPackageController,  
  togglePopularPackageController,  
  updatePackageController,
} from './packageController';
import {
  packageValidation,
  updatePackageValidation,
} from './packageValidation';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('packages');
const uploader = upload.single('thumbnail');

const parsePackageData = (req: Request, res: Response, next: NextFunction) => {
  req.body = req.body.data ? JSON.parse(req.body.data) : req.body;
  next();
};

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  parsePackageData,
  verifyValidate(packageValidation),
  addPackageController,
);
Router.get('/all', getAllPackageController);
Router.get('/counts', getPackageCountsController);
Router.get('/:id', getSinglePackageController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  parsePackageData,
  verifyValidate(updatePackageValidation),
  updatePackageController,
);
Router.patch('/toggle-popular/:id', togglePopularPackageController);
Router.patch('/toggle-featured/:id', toggleFeaturedPackageController);
Router.delete('/delete/:id', deletePackageController);

export const packagesRoute = Router;
