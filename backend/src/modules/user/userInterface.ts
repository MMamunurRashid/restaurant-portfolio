export type IUser = {
  email: string;
  name: string;
  password: string;
  role: string;
  profileUrl?: string;
  status: 'active' | 'blocked';
};
