import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  addMessageController,
  deleteMessageController,
  getAllMessageController,
  getMessageCountsController,
  getSingleMessageController,
  markMessageAsReadController,
  updateMessageController,
} from './messageController';
import {
  messageValidation,
  updateMessageValidation,
} from './messageValidation';

Router.post('/add', verifyValidate(messageValidation), addMessageController);
Router.get('/all', getAllMessageController);
Router.get('/counts', getMessageCountsController);
Router.get('/:id', getSingleMessageController);
Router.patch(
  '/update/:id',
  verifyValidate(updateMessageValidation),
  updateMessageController,
);
Router.patch('/mark-as-read/:id', markMessageAsReadController);
Router.delete('/delete/:id', deleteMessageController);

export const messagesRoute = Router;
