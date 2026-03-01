import { model, Schema } from 'mongoose';
import { IBlog } from './blogInterface';

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
});

export const Blog = model<IBlog>('Blog', blogSchema);
