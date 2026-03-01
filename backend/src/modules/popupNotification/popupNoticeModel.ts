import { model, Schema } from 'mongoose';
import { IPopupNotice } from './popupNoticeInterface';

const popupNoticeSchema = new Schema<IPopupNotice>({
  image: { type: String, required: true },
  link: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: false },
});

export const PopupNotice = model<IPopupNotice>(
  'PopupNotice',
  popupNoticeSchema,
);
