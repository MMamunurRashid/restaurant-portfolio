import { model, Schema } from 'mongoose';
import { IGtm } from './gtmInterface';

const gtmSchema = new Schema<IGtm>({
  gtmId: { type: String },
});

export const GTM = model<IGtm>('GTM', gtmSchema);
