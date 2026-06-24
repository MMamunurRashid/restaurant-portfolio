import { catchAsync } from '../../utils/catchAsync';
import {
  getSmtpConfigService,
  updateSmtpConfigService,
} from './smtpConfigService';

export const getSmtpConfigController = catchAsync(async (req, res) => {
  const result = await getSmtpConfigService();

  res.status(200).json({
    success: true,
    message: 'SMTP config fetched successfully',
    data: result,
  });
});

export const updateSmtpConfigController = catchAsync(async (req, res) => {
  const result = await updateSmtpConfigService(req.body);

  res.status(200).json({
    success: true,
    message: 'SMTP config updated successfully',
    data: result,
  });
});
