import { catchAsync } from '../../utils/catchAsync';
import {
  getCloudinaryConfigService,
  updateCloudinaryConfigService,
} from './cloudinaryConfigService';

export const getCloudinaryConfigController = catchAsync(async (req, res) => {
  const result = await getCloudinaryConfigService();

  res.status(200).json({
    success: true,
    message: 'Cloudinary config fetched successfully',
    data: result,
  });
});

export const updateCloudinaryConfigController = catchAsync(
  async (req, res) => {
    const result = await updateCloudinaryConfigService(req.body);

    res.status(200).json({
      success: true,
      message: 'Cloudinary config updated successfully',
      data: result,
    });
  },
);
