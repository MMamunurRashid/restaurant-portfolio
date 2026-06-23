import { model, Schema } from 'mongoose';
import { IBanner } from './bannerInterface';

const bannerSchema = new Schema<IBanner>({
  order: { type: Number, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String, trim: true }],
});

export const Banner = model<IBanner>('Banner', bannerSchema);
