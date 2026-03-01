import { z } from 'zod';

export const testimonialValidation = z.object({});

export const updateTestimonialValidation = testimonialValidation.partial();
