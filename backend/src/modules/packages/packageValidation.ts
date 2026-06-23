import { z } from 'zod';

export const packageValidation = z.object({
    title: z.string().min(1, 'Package title is required'),
    services: z.array(z.string()).min(1, 'At least one included item is required'),
    price: z.number().min(0, 'Price must be a positive number'),
    description: z.string().optional(),
    order: z.number().min(0, 'Order must be a positive number').optional(),
    isPopular: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
});

export const updatePackageValidation = packageValidation.partial();
