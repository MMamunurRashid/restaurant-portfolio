export type IMessage = {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  isRead: boolean;
};
