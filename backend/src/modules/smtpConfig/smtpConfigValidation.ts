import { z } from 'zod';

const optionalEmail = z
  .string()
  .trim()
  .email('Invalid email address')
  .or(z.literal(''))
  .optional();

const booleanValue = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

export const smtpConfigValidation = z.object({
  smtpHost: z.string().trim().optional(),
  smtpPort: z.coerce.number().int().min(1).max(65535).optional(),
  smtpSecure: booleanValue.optional(),
  smtpUser: z.string().trim().optional(),
  smtpPass: z.string().optional(),
  smtpFromEmail: optionalEmail,
  smtpFromName: z.string().trim().optional(),
  mailAdminTo: z.string().trim().optional(),
  isActive: booleanValue.optional(),
});
