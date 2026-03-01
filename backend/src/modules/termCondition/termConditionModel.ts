import { model, Schema } from 'mongoose';
import { ITermCondition } from './termConditionInterface';

const termConditionSchema = new Schema<ITermCondition>({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export const TermCondition = model<ITermCondition>(
  'TermCondition',
  termConditionSchema,
);
