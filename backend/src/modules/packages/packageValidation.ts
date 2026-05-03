import { z } from 'zod';

export const packageValidation = z.object({
    title: z.string().min(1, 'Name is required'),
    services: z.array(z.string()).min(1, 'Services are required'),
    price: z.number().min(0, 'Price must be a positive number'),    
});

export const updatePackageValidation = packageValidation.partial();
