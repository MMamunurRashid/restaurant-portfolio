import { z } from 'zod';

export const seoValidation = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  subject: z.string().optional(),
  description: z.string().min(3).max(200),

  ogTitle: z.string().optional(),
  ogType: z.string().optional(),
  ogUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
  ogDescription: z.string().optional(),
  ogSiteName: z.string().optional(),

  facebook_domain_verification: z.string().optional(),
  google_site_verification: z.string().optional(),
});

export const updateSeoValidation = seoValidation.partial();
