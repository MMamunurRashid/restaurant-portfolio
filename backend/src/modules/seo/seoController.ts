import { catchAsync } from '../../utils/catchAsync';
import { ISeo } from './seoInterface';
import {
  createSeoService,
  getSeoService,
  updateSeoService,
} from './seoService';

export const createSeoController = catchAsync(async (req, res) => {
  const data: ISeo = req.body;

  const result = await createSeoService(data);

  res.status(200).json({
    success: true,
    message: 'Seo create successfully',
    data: result,
  });
});

export const getSeoController = catchAsync(async (req, res) => {
  const result = await getSeoService();

  res.status(200).json({
    success: true,
    message: 'Seo get successfully',
    data: result,
  });
});

export const updateSeoController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data: ISeo = req.body;

  const result = await updateSeoService(id, data);

  res.status(200).json({
    success: true,
    message: 'Seo update successfully',
    data: result,
  });
});
