import type { IRole } from "./roleInterface";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  designation: string;
  password: string;
  needsPasswordChange: boolean;
  role: string;
  rolePermission?: IRole[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserProps {
  targetedUser: IUser;
}
