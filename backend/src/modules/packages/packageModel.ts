import { model, Schema } from 'mongoose';
import { IPackage } from './packageInterface';

const packageSchema = new Schema<IPackage>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  services: { type: [String], required: true },
  price: { type: Number, required: true },
  isPopular: { type: Boolean, required: true, default: false },
  isFeatured: { type: Boolean, required: true, default: false },
});

export const Package = model<IPackage>('Package', packageSchema);
