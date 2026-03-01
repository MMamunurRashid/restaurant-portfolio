import { catchAsync } from '../../utils/catchAsync';
import {
  addPrivacyPolicyService,
  getPrivacyPolicyService,
  updatePrivacyPolicyService,
} from './privacyPolicyService';

export const addPrivacyPolicyController = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await addPrivacyPolicyService(data);

  res.status(200).json({
    success: true,
    message: 'Privacy Policy created successfully',
    data: result,
  });
});

export const getPrivacyPolicyController = catchAsync(async (req, res) => {
  const result = await getPrivacyPolicyService();

  res.status(200).json({
    success: true,
    message: 'Privacy Policy retrieved successfully',
    data: result,
  });
});

export const updatePrivacyPolicyController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await updatePrivacyPolicyService(id, data);

  res.status(200).json({
    success: true,
    message: 'Privacy Policy updated successfully',
    data: result,
  });
});
