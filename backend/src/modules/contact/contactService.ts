import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { IContact } from './contactInterface';
import { Contact } from './contactModel';

export const addContactService = async (data: IContact) => {
  const isExist = await Contact.findOne();
  if (isExist)
    throw new AppError(httpStatus.BAD_REQUEST, 'Contact already exist');

  const result = await Contact.create(data);
  return result;
};

export const getContactService = async () => {
  const result = await Contact.findOne();
  return result;
};

export const updateContactService = async (id: string, data: IContact) => {
  const isExist = await Contact.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Contact not found');

  const result = await Contact.findByIdAndUpdate(id, data, { new: true });
  return result;
};
