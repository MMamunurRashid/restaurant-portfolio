import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IMessage } from './messageInterface';
import { Message } from './messageModel';
import QueryBuilder from '../../builders/QueryBuilder';
import { sendAudienceQueryNotification } from '../../utils/notificationMail';

export const addMessageService = async (data: IMessage) => {
  const result = await Message.create({ ...data });
  await sendAudienceQueryNotification(result);
  return result;
};

export const getAllMessageService = async (query: Record<string, unknown>) => {
  const result = new QueryBuilder(Message.find(), query)
    .search(['name', 'email', 'phone', 'message'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await result.countTotal();
  const data = await result.modelQuery;

  return {
    meta,
    data,
  };
};

export const getSingleMessageService = async (id: string) => {
  const result = await Message.findById(id);
  return result;
};

export const updateMessageService = async (id: string, data: IMessage) => {
  const isExist = await Message.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Message not found !');

  const result = await Message.findByIdAndUpdate(
    id,
    { ...data },
    { new: true },
  );
  return result;
};

export const deleteMessageService = async (id: string) => {
  const isExist = await Message.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Message not found !');

  await Message.findByIdAndDelete(id);
  return true;
};

export const markMessageAsReadService = async (id: string) => {
  const isExist = await Message.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Message not found !');
  if (isExist.isRead) return isExist;

  isExist.isRead = true;
  const result = await isExist.save();
  return result;
};

export const getMessageCountsService = async () => {
  const totalMessages = await Message.countDocuments();
  const unreadMessages = await Message.countDocuments({ isRead: false });
  return { totalMessages, unreadMessages };
};
