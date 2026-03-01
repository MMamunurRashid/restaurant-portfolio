import { model, Schema } from 'mongoose';
import { ITeamCategory } from './teamCategoryInterface';
import { Team } from '../team/teamModel';

const teamCategorySchema = new Schema<ITeamCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  order: { type: Number, required: true },
  description: { type: String },
});

teamCategorySchema.pre('findOneAndDelete', async function (next) {
  const categoryId = this.getQuery()._id;

  const teamCount = await Team.countDocuments({ category: categoryId });

  if (teamCount > 0) {
    return next(
      new Error(
        'Cannot delete team category with associated teams. Please delete the teams first.',
      ),
    );
  }

  next();
});

export const TeamCategory = model<ITeamCategory>(
  'TeamCategory',
  teamCategorySchema,
);
