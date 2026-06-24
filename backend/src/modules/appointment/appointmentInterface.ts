import { Types } from 'mongoose';

export type TAppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export type IAppointmentPackageSnapshot = {
  package?: Types.ObjectId;
  title: string;
  price?: number;
  services?: string[];
  thumbnail?: string;
};

export type IAppointmentTableSnapshot = {
  table?: Types.ObjectId;
  tableNumber: string;
  capacity: number;
  area?: string;
};

export type IAppointment = {
  reservationCode?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  packages?: Types.ObjectId[];
  packageSnapshot?: IAppointmentPackageSnapshot[];
  assignedTable?: Types.ObjectId;
  tableSnapshot?: IAppointmentTableSnapshot;
  date: Date;
  time: string;
  guestCount: number;
  notes?: string;
  adminNotes?: string;
  cancelReason?: string;
  status: TAppointmentStatus;
  isRead: boolean;
  source?: 'website' | 'admin';
  contactedAt?: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  completedAt?: Date;
  noShowAt?: Date;
  tableAssignedAt?: Date;
  reminderSentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
