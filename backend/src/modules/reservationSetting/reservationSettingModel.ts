import { model, Schema } from 'mongoose';
import {
  IReservationBlackoutDate,
  IReservationDayHours,
  IReservationSetting,
} from './reservationSettingInterface';

const reservationDayHoursSchema = new Schema<IReservationDayHours>(
  {
    day: {
      type: String,
      enum: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
      required: true,
    },
    isOpen: { type: Boolean, default: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
  },
  { _id: false },
);

const reservationBlackoutDateSchema = new Schema<IReservationBlackoutDate>(
  {
    date: { type: Date, required: true },
    reason: { type: String, trim: true },
  },
  { _id: false },
);

const reservationSettingSchema = new Schema<IReservationSetting>(
  {
    isActive: { type: Boolean, default: true },
    slotIntervalMinutes: { type: Number, default: 30, min: 15 },
    maxGuestsPerSlot: { type: Number, default: 20, min: 1 },
    minGuestCount: { type: Number, default: 1, min: 1 },
    maxGuestCount: { type: Number, default: 20, min: 1 },
    advanceBookingDays: { type: Number, default: 30, min: 0 },
    cutoffHours: { type: Number, default: 2, min: 0 },
    weeklyHours: { type: [reservationDayHoursSchema], default: undefined },
    blackoutDates: { type: [reservationBlackoutDateSchema], default: [] },
  },
  { timestamps: true },
);

export const ReservationSetting = model<IReservationSetting>(
  'ReservationSetting',
  reservationSettingSchema,
);
