import { Types } from 'mongoose';

export type ITeam = {
  order: number;
  name: string;
  designation: string;
  image: string;
  category: Types.ObjectId;
};
