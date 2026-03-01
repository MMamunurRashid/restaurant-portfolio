import { z } from 'zod';

export const bannerValidation = z.object({
  order: z.number().min(1),
  link: z.string({ required_error: 'Link is required.' }),
});

export const updateBannerValidation = bannerValidation.partial();
