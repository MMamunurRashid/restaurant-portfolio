import { model, Schema } from 'mongoose';
import { IDiningTable } from './diningTableInterface';

const diningTableSchema = new Schema<IDiningTable>(
  {
    tableNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    capacity: { type: Number, required: true, min: 1 },
    area: { type: String, trim: true },
    description: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const DiningTable = model<IDiningTable>(
  'DiningTable',
  diningTableSchema,
);
