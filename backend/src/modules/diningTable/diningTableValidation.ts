import { z } from 'zod';

const booleanValue = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

export const diningTableValidation = z.object({
  tableNumber: z.string().trim().min(1, 'Table number is required'),
  capacity: z.coerce.number().int().min(1, 'Table capacity is required'),
  area: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: booleanValue.optional(),
});

export const updateDiningTableValidation = diningTableValidation.partial();
