import { z } from 'zod';

export const campaignValidation = z.object({});

export const updateCampaignValidation = campaignValidation.partial();
