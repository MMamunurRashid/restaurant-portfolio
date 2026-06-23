import { z } from 'zod';

export const appointmentValidation = z.object({
  name: z.string().min(1, 'Guest name is required'),
  phone: z.string().min(1, 'Guest phone is required'),
  date: z.string().min(1, 'Reservation date is required'),
});

export const updateAppointmentValidation = appointmentValidation.partial();
