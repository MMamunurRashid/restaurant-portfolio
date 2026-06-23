import { z } from 'zod';

export const bannerValidation = z.object({
  order: z.number().min(1),
  title: z.string({ required_error: 'Title is required.' }).min(1),
  description: z.string({ required_error: 'Description is required.' }).min(1),
  highlights: z.array(z.string().min(1)).optional(),
});

export const updateBannerValidation = bannerValidation.partial();
