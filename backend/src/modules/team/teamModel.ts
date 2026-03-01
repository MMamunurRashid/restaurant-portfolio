import { model, Schema } from 'mongoose';
import { ITeam } from './teamInterface';

const teamSchema = new Schema<ITeam>({
  order: { type: Number, required: true },

  name: { type: String, required: true },
  designation: { type: String, required: true },
  image: { type: String, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'TeamCategory',
    required: true,
  },
});

export const Team = model<ITeam>('Team', teamSchema);
