import type { IPackage } from "./packageInterface";

export type IAppointment = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  packages?: IPackage[];
  date: Date;
  time?: string;
  notes?: string;
};
