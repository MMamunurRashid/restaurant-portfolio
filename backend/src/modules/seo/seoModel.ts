import { model, Schema } from 'mongoose';
import { ISeo } from './seoInterface';

const seoSchema = new Schema<ISeo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: { type: [String], default: [] },
  author: { type: String },
  subject: { type: String },
  copyright: { type: String },

  facebook_domain_verification: { type: String },
  google_site_verification: { type: String },
});

export const SEO = model<ISeo>('SEO', seoSchema);
