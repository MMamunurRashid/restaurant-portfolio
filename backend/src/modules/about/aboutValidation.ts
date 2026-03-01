import { z } from 'zod';

export const aboutValidation = z.object({});

export const updateAboutValidation = aboutValidation.partial();
