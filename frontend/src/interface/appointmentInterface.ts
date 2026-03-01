import type { IService } from "./serviceInterface";

export type IAppointment = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  service: IService;
  date: Date;
};
