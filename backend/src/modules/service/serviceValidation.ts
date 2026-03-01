import { z } from 'zod';

export const serviceValidation = z.object({});

export const updateServiceValidation = serviceValidation.partial();
