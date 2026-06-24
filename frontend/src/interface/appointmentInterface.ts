import type { IPackage } from "./packageInterface";
import type { IDiningTable } from "./diningTableInterface";

export type TAppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export type IAppointmentPackageSnapshot = {
  package?: string;
  title: string;
  price?: number;
  services?: string[];
  thumbnail?: string;
};

export type IAppointmentTableSnapshot = {
  table?: string;
  tableNumber: string;
  capacity: number;
  area?: string;
};

export type IAppointment = {
  _id: string;
  reservationCode?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  packages?: IPackage[];
  packageSnapshot?: IAppointmentPackageSnapshot[];
  assignedTable?: IDiningTable;
  tableSnapshot?: IAppointmentTableSnapshot;
  date: Date;
  time?: string;
  guestCount?: number;
  notes?: string;
  adminNotes?: string;
  cancelReason?: string;
  status?: TAppointmentStatus;
  isRead?: boolean;
  source?: "website" | "admin";
  contactedAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  noShowAt?: string;
  tableAssignedAt?: string;
  reminderSentAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
