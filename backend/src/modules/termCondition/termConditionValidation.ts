import { z } from 'zod';

export const termConditionValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const updateTermConditionValidation = termConditionValidation.partial();
