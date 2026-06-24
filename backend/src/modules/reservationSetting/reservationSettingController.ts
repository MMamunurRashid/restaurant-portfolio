import { catchAsync } from '../../utils/catchAsync';
import {
  getReservationSettingService,
  updateReservationSettingService,
} from './reservationSettingService';

export const getReservationSettingController = catchAsync(async (req, res) => {
  const result = await getReservationSettingService();

  res.status(200).json({
    success: true,
    message: 'Reservation settings fetched successfully',
    data: result,
  });
});

export const updateReservationSettingController = catchAsync(
  async (req, res) => {
    const result = await updateReservationSettingService(req.body);

    res.status(200).json({
      success: true,
      message: 'Reservation settings updated successfully',
      data: result,
    });
  },
);
