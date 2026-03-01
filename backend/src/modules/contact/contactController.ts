import { catchAsync } from '../../utils/catchAsync';
import {
  addContactService,
  getContactService,
  updateContactService,
} from './contactService';

export const addContactController = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await addContactService(data);

  res.status(200).json({
    success: true,
    message: 'Contact create successfully',
    data: result,
  });
});

export const getContactController = catchAsync(async (req, res) => {
  const result = await getContactService();

  res.status(200).json({
    success: true,
    message: 'Contact get successfully',
    data: result,
  });
});

export const updateContactController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await updateContactService(id, data);

  res.status(200).json({
    success: true,
    message: 'Contact update successfully',
    data: result,
  });
});
