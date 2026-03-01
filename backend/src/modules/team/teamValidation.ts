import { z } from 'zod';

export const teamValidation = z.object({
  order: z.number().min(1),

  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  image: z.string().min(1, 'Image is required'),
});

export const updateTeamValidation = teamValidation.partial();
