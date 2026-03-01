import express, { NextFunction, Request, Response } from 'express';
const Router = express.Router();
import {
  addTeamController,
  deleteTeamController,
  getAllTeamController,
  getSingleTeamController,
  getTeamCountController,
  updateTeamController,
} from './teamController';
import { fileUploader } from '../../utils/fileUploader';

const { upload, uploadAndConvert } = fileUploader('team');
const uploader = upload.single('image');

Router.post(
  '/add',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  addTeamController,
);
Router.get('/all', getAllTeamController);
Router.get('/count', getTeamCountController);
Router.get('/:id', getSingleTeamController);
Router.patch(
  '/update/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateTeamController,
);
Router.delete('/delete/:id', deleteTeamController);

export const teamRoute = Router;
