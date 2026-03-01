import { z } from 'zod';

export const appointmentValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  date: z.string().min(1, 'Date is required'),
});

export const updateAppointmentValidation = appointmentValidation.partial();
