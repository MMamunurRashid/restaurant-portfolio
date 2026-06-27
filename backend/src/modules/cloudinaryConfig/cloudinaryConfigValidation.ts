import { z } from 'zod';

const booleanValue = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

export const cloudinaryConfigValidation = z.object({
  cloudName: z.string().trim().optional(),
  apiKey: z.string().trim().optional(),
  apiSecret: z.string().optional(),
  folder: z.string().trim().optional(),
  isActive: booleanValue.optional(),
});
