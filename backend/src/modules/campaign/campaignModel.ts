import { model, Schema } from 'mongoose';
import { ICampaign } from './campaignInterface';

const campaignSchema = new Schema<ICampaign>({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true },
});

export const Campaign = model<ICampaign>('Campaign', campaignSchema);
