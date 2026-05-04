import express from 'express';
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

Router.post('/add', verifyValidate(galleryValidation), addGalleryController);
Router.get('/all', getAllGalleryController);
Router.get('/counts', getGalleryCountController);
Router.get('/:id', getSingleGalleryController);
Router.patch('/update/:id', verifyValidate(updateGalleryValidation), updateGalleryController);
Router.delete('/delete/:id', deleteGalleryController);

export const galleryRoute = Router;
