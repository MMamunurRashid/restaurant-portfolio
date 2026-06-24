import { z } from 'zod';

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm format');

const booleanValue = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

const weekday = z.enum([
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]);

const dayHours = z.object({
  day: weekday,
  isOpen: booleanValue,
  openTime: time,
  closeTime: time,
});

const blackoutDate = z.object({
  date: z.string().min(1, 'Blackout date is required'),
  reason: z.string().trim().optional().or(z.literal('')),
});

export const reservationSettingValidation = z.object({
  isActive: booleanValue.optional(),
  slotIntervalMinutes: z.coerce.number().int().min(15).max(180).optional(),
  maxGuestsPerSlot: z.coerce.number().int().min(1).max(500).optional(),
  minGuestCount: z.coerce.number().int().min(1).max(500).optional(),
  maxGuestCount: z.coerce.number().int().min(1).max(500).optional(),
  advanceBookingDays: z.coerce.number().int().min(0).max(365).optional(),
  cutoffHours: z.coerce.number().min(0).max(168).optional(),
  weeklyHours: z.array(dayHours).min(1).max(7).optional(),
  blackoutDates: z.array(blackoutDate).optional(),
});
