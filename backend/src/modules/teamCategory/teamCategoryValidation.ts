import { z } from 'zod';

export const teamCategoryValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  order: z.number().int().nonnegative('Order must be a non-negative integer'),
});
