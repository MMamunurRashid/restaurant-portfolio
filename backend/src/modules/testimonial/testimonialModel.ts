import { model, Schema } from 'mongoose';
import { ITestimonial } from './testimonialInterface';

const testimonialSchema = new Schema<ITestimonial>({
  image: { type: String, required: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  review: { type: String, required: true },
});

export const Testimonial = model<ITestimonial>(
  'Testimonial',
  testimonialSchema,
);
