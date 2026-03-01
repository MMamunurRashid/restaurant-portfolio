export interface IUser {
  _id: string;
  email: string;
  name: string;
  designation: string;
  password: string;
  needsPasswordChange: boolean;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserProps {
  targetedUser: IUser;
}
