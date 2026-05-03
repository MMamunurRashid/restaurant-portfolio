import { Types } from 'mongoose';

export type IAppointment = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  packages: Types.ObjectId[]; // Array of package IDs
  date: Date;
  time: string;
  notes?: string;
};
