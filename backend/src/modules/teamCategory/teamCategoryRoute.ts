import express from 'express';
const Router = express.Router();
import verifyValidate from '../../middlewares/verifyValidate';
import {
  addTeamCategoryController,
  deleteTeamCategoryController,
  getAllTeamCategoryController,
  getSingleTeamCategoryController,
  updateTeamCategoryController,
} from './teamCategoryController';
import { teamCategoryValidation } from './teamCategoryValidation';

Router.post(
  '/add',
  verifyValidate(teamCategoryValidation),
  addTeamCategoryController,
);
Router.get('/all', getAllTeamCategoryController);
Router.get('/:id', getSingleTeamCategoryController);
Router.patch(
  '/update/:id',
  verifyValidate(teamCategoryValidation),
  updateTeamCategoryController,
);
Router.delete('/delete/:id', deleteTeamCategoryController);

export const teamCategoryRoute = Router;
