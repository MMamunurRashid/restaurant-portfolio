import { z } from 'zod';

export const messageValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(1, 'Phone is required'),
  message: z.string().min(1, 'Message is required'),
});

export const updateMessageValidation = messageValidation.partial();
