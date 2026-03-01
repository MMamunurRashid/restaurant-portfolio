import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { ICampaign } from './campaignInterface';
import { Campaign } from './campaignModel';

export const addCampaignService = async (data: ICampaign) => {
  const result = await Campaign.create(data);
  return result;
};

export const getCampaignService = async () => {
  const result = await Campaign.findOne({});
  return result;
};

export const getSingleCampaignService = async (id: string) => {
  const result = await Campaign.findById(id);
  return result;
};

export const updateCampaignService = async (id: string, data: ICampaign) => {
  const isExist = await Campaign.findById(id);
  if (!isExist) {
    if (data?.image) deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.NOT_FOUND, 'Campaign not found !');
  }

  const result = await Campaign.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (result) {
    if (data?.image) deleteFile(`./uploads/${isExist?.image}`);
  }

  return result;
};

export const deleteCampaignService = async (id: string) => {
  const isExist = await Campaign.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Campaign not found !');
  }

  await Campaign.findByIdAndDelete(id);

  if (isExist?.image) deleteFile(`./uploads/${isExist?.image}`);

  return true;
};
