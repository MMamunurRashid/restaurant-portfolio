import { catchAsync } from '../../utils/catchAsync';
import {
  addTermConditionService,
  getTermConditionService,
  updateTermConditionService,
} from './termConditionService';

export const addTermConditionController = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await addTermConditionService(data);

  res.status(200).json({
    success: true,
    message: 'Term Condition created successfully',
    data: result,
  });
});

export const getTermConditionController = catchAsync(async (req, res) => {
  const result = await getTermConditionService();

  res.status(200).json({
    success: true,
    message: 'Term Condition retrieved successfully',
    data: result,
  });
});

export const updateTermConditionController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await updateTermConditionService(id, data);
  res.status(200).json({
    success: true,
    message: 'Term Condition updated successfully',
    data: result,
  });
});
