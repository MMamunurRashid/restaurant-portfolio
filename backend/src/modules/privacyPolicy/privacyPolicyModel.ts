import { model, Schema } from 'mongoose';
import { IPrivacyPolicy } from './privacyPolicyInterface';

const privacyPolicySchema = new Schema<IPrivacyPolicy>({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export const PrivacyPolicy = model<IPrivacyPolicy>(
  'PrivacyPolicy',
  privacyPolicySchema,
);
