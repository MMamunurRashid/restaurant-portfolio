import { Types } from 'mongoose';

export type IAppointment = {
  name: string;
  phone: string;
  email?: string;
  service: Types.ObjectId;
  date: Date;
};
