import { z } from 'zod';

const galleryImageSchema = z.object({
  title: z.string().optional(),
  image: z.string().min(1, 'Image path is required'),
});

export const galleryValidation = z.object({
  title: z.string().min(1, 'Gallery title is required'),
  images: z.array(galleryImageSchema).min(0).optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

export const updateGalleryValidation = galleryValidation.partial();
