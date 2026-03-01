import { z } from 'zod';

export const contactValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  email: z.string().min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
});

export const updateContactValidation = contactValidation.partial();
