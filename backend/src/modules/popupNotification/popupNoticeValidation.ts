import { z } from 'zod';

export const popupNoticeValidation = z.object({});

export const updatePopupNoticeValidation = popupNoticeValidation.partial();
