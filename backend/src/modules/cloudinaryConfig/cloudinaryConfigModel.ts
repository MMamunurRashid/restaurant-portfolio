import { model, Schema } from 'mongoose';
import { ICloudinaryConfig } from './cloudinaryConfigInterface';

const cloudinaryConfigSchema = new Schema<ICloudinaryConfig>(
  {
    cloudName: { type: String },
    apiKey: { type: String },
    apiSecret: { type: String, select: false },
    folder: { type: String, default: 'foodie-cafe' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CloudinaryConfig = model<ICloudinaryConfig>(
  'CloudinaryConfig',
  cloudinaryConfigSchema,
);
