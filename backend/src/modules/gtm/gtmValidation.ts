import { z } from 'zod';

export const gtmValidation = z.object({
  gtmId: z.string().optional(),
});
