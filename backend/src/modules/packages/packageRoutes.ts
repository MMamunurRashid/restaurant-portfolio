import express from 'express';
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

Router.post('/add', verifyValidate(packageValidation), addPackageController);
Router.get('/all', getAllPackageController);
Router.get('/counts', getPackageCountsController);
Router.get('/:id', getSinglePackageController);
Router.patch(
  '/update/:id',
  verifyValidate(updatePackageValidation),
  updatePackageController,
);
Router.patch('/toggle-popular/:id', togglePopularPackageController);
Router.patch('/toggle-featured/:id', toggleFeaturedPackageController);
Router.delete('/delete/:id', deletePackageController);

export const packagesRoute = Router;
