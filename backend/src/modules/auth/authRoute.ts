import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import { loginValidation } from './authValidation';
import { loginUserController } from './authController';

Router.post('/login', verifyValidate(loginValidation), loginUserController);

export const authRoute = Router;
