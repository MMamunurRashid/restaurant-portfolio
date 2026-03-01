import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addTestimonialController,
  deleteTestimonialController,
  getAllTestimonialController,
  getSingleTestimonialController,
  updateTestimonialController,
} from './testimonialController';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('testimonial');
const uploader = upload.single('image');

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addTestimonialController,
);
Router.get('/all', getAllTestimonialController);
Router.get('/:id', getSingleTestimonialController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateTestimonialController,
);
Router.delete('/delete/:id', deleteTestimonialController);

export const testimonialRoute = Router;
