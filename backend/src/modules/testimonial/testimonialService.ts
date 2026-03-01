import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { ITestimonial } from './testimonialInterface';
import { Testimonial } from './testimonialModel';

export const addTestimonialService = async (data: ITestimonial) => {
  const result = await Testimonial.create(data);
  return result;
};

export const getAllTestimonialService = async () => {
  const result = await Testimonial.find({});
  return result;
};

export const getSingleTestimonialService = async (id: string) => {
  const result = await Testimonial.findById(id);
  return result;
};

export const updateTestimonialService = async (
  id: string,
  data: ITestimonial,
) => {
  const isExist = await Testimonial.findById(id);
  if (!isExist) {
    deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found !');
  }

  const result = await Testimonial.findByIdAndUpdate(id, data, { new: true });
  if (result && data?.image) deleteFile(`./uploads/${isExist?.image}`);
  return result;
};

export const deleteTestimonialService = async (id: string) => {
  const isExist = await Testimonial.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found !');
  }

  await Testimonial.findByIdAndDelete(id);
  deleteFile(`./uploads/${isExist?.image}`);
  return true;
};
