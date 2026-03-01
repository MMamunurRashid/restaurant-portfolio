import express, { NextFunction, Request, Response } from 'express';
import {
  addUserController,
  deleteUserController,
  getAllUserController,
  getSingleUserController,
  getUserCountController,
  updatePasswordController,
  updateProfileController,
  updateUserController,
} from './userController';
import verifyValidate from '../../middlewares/verifyValidate';
import { userValidation } from './userValidation';
import { fileUploader } from '../../utils/fileUploader';
import { auth } from '../../middlewares/auth';
const Router = express.Router();

const { upload, uploadAndConvert } = fileUploader('user');
const uploader = upload.single('image');

Router.post(
  '/add',
  verifyValidate(userValidation),
  auth('superAdmin', 'admin'),
  addUserController,
);
Router.get('/all', auth('superAdmin', 'admin'), getAllUserController);
Router.get('/count', getUserCountController);
Router.get('/:id', getSingleUserController);
Router.put('/update/:id', updateUserController);
Router.put(
  '/update/profile/:id',
  uploader,
  uploadAndConvert,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = req.body.data && JSON.parse(req.body.data);
    next();
  },
  updateProfileController,
);
Router.put('/update/password/:id', updatePasswordController);
Router.delete('/delete/:id', deleteUserController);

export const userRoute = Router;
