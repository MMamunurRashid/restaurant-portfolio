import { model, Schema } from 'mongoose';
import { IAbout } from './aboutInterface';

const aboutSchema = new Schema<IAbout>({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true },
  stats: [
    {
      count: { type: String, required: true },
      title: { type: String, required: true },
    },
  ],
});

export const About = model<IAbout>('About', aboutSchema);
