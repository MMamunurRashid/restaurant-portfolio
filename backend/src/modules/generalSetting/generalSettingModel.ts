import { model, Schema } from 'mongoose';
import { IGeneralSetting } from './generalSettingInterface';

const generalSettingSchema = new Schema<IGeneralSetting>({
  logo: { type: String, required: true },
  favicon: { type: String },
  footerImage: { type: String },
  siteName: { type: String, required: true },
  tagline: { type: String },
  siteTitle: { type: String, required: true },
});

export const GeneralSetting = model<IGeneralSetting>(
  'GeneralSetting',
  generalSettingSchema,
);
