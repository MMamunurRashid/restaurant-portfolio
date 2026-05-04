import { model, Schema } from 'mongoose';
import { IContact } from './contactInterface';

const contactSchema = new Schema<IContact>({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  whatsappLink: { type: String },
  messengerLink: { type: String },
  googleMapLink: { type: String },
  socials: [
    {
      icon: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  officeHours: [
    {
      day: { type: String, required: true },
      hours: { type: String, required: true },
    },
  ],
});

export const Contact = model<IContact>('Contact', contactSchema);
