import { model, Schema } from 'mongoose';
import { IService } from './serviceInterface';

const serviceSchema = new Schema<IService>(
  {
    thumbnail: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    galleries: {
      type: [String],
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Service = model<IService>('Service', serviceSchema);
