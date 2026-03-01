import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addBlogController,
  deleteBlogController,
  getAllBlogController,
  getBlogBySlugController,
  getBlogCountController,
  getSingleBlogController,
  toggleBlogStatusController,
  updateBlogController,
} from './blogController';
import { fileUploader } from '../../utils/fileUploader';
const { upload, uploadAndConvert } = fileUploader('blog');
const uploader = upload.single('image');

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addBlogController,
);
Router.get('/all', getAllBlogController);
Router.get('/count', getBlogCountController);
Router.get('/:id', getSingleBlogController);
Router.get('/slug/:slug', getBlogBySlugController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateBlogController,
);
Router.delete('/delete/:id', deleteBlogController);
Router.patch('/toggle/:id', toggleBlogStatusController);

export const blogRoute = Router;
