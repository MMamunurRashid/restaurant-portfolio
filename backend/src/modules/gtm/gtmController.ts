import { catchAsync } from '../../utils/catchAsync';
import {
  createGtmService,
  getGtmService,
  updateGtmService,
} from './gtmService';
import { IGtm } from './gtmInterface';

export const createGtmController = catchAsync(async (req, res) => {
  const data: IGtm = req.body;

  const result = await createGtmService(data);

  res.status(200).json({
    success: true,
    message: 'Gtm create successfully',
    data: result,
  });
});

export const getGtmController = catchAsync(async (req, res) => {
  const result = await getGtmService();

  res.status(200).json({
    success: true,
    message: 'Gtm get successfully',
    data: result,
  });
});

export const updateGtmController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data: IGtm = req.body;

  const result = await updateGtmService(id, data);
  res.status(200).json({
    success: true,
    message: 'Gtm update successfully',
    data: result,
  });
});
