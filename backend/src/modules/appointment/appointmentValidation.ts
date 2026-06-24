import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid package id');

const optionalObjectId = objectId.optional().or(z.literal('')).or(z.null());

const optionalText = z.string().trim().optional().or(z.literal(''));
const optionalEmail = z
  .string()
  .trim()
  .email('Invalid guest email')
  .optional()
  .or(z.literal(''));

const date = z.string().min(1, 'Reservation date is required').refine(
  (value) => {
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime());
  },
  { message: 'Invalid reservation date' },
);

const time = z
  .string()
  .min(1, 'Reservation time is required')
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid reservation time');

const guestCount = z
  .coerce.number({
    required_error: 'Guest count is required',
    invalid_type_error: 'Guest count must be a number',
  })
  .int('Guest count must be a whole number')
  .min(1, 'Guest count must be at least 1')
  .max(50, 'Guest count cannot be more than 50');

export const appointmentValidation = z.object({
  name: z.string().trim().min(1, 'Guest name is required'),
  phone: z.string().trim().min(1, 'Guest phone is required'),
  email: optionalEmail,
  address: optionalText,
  packages: z.array(objectId).optional(),
  date,
  time,
  guestCount,
  notes: optionalText,
});

export const updateAppointmentValidation = z.object({
  name: z.string().trim().min(1, 'Guest name is required').optional(),
  phone: z.string().trim().min(1, 'Guest phone is required').optional(),
  email: optionalEmail,
  address: optionalText,
  packages: z.array(objectId).optional(),
  date: date.optional(),
  time: time.optional(),
  guestCount: guestCount.optional(),
  notes: optionalText,
  adminNotes: optionalText,
  cancelReason: optionalText,
  status: z
    .enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])
    .optional(),
  assignedTable: optionalObjectId.optional(),
  isRead: z.boolean().optional(),
});

export const assignTableValidation = z.object({
  tableId: optionalObjectId.optional(),
});
