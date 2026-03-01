import { model, Schema } from 'mongoose';
import { IMessage } from './messageInterface';

const messageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, required: true, default: false },
});

export const Message = model<IMessage>('Message', messageSchema);
