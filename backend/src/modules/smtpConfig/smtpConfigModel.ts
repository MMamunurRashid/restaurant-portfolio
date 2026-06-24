import { model, Schema } from 'mongoose';
import { ISmtpConfig } from './smtpConfigInterface';

const smtpConfigSchema = new Schema<ISmtpConfig>(
  {
    smtpHost: { type: String },
    smtpPort: { type: Number, default: 587 },
    smtpSecure: { type: Boolean, default: false },
    smtpUser: { type: String },
    smtpPass: { type: String, select: false },
    smtpFromEmail: { type: String },
    smtpFromName: {
      type: String,
      default: 'Prestige Cafe & Restaurant',
    },
    mailAdminTo: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const SmtpConfig = model<ISmtpConfig>('SmtpConfig', smtpConfigSchema);
