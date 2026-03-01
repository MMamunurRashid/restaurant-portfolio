import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { deleteFile } from '../../utils/deleteFile';
import { IBlog } from './blogInterface';
import { Blog } from './blogModel';
import QueryBuilder from '../../builders/QueryBuilder';

export const addBlogService = async (data: IBlog) => {
  const result = await Blog.create(data);
  return result;
};

export const getAllBlogService = async (query: Record<string, unknown>) => {
  const result = new QueryBuilder(Blog.find(), query)
    .search(['title', 'slug'])
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

export const getSingleBlogService = async (id: string) => {
  const result = await Blog.findById(id);
  return result;
};

export const getBlogBySlugService = async (slug: string) => {
  const result = await Blog.findOne({ slug });
  return result;
};

export const updateBlogService = async (id: string, data: IBlog) => {
  const isExist = await Blog.findById(id);
  if (!isExist) {
    deleteFile(`./uploads/${data?.image}`);
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found !');
  }

  const result = await Blog.findByIdAndUpdate(id, data, { new: true });
  if (result && data?.image) deleteFile(`./uploads/${isExist?.image}`);
  return result;
};

export const deleteBlogService = async (id: string) => {
  const isExist = await Blog.findById(id);
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found !');
  }

  await Blog.findByIdAndDelete(id);
  deleteFile(`./uploads/${isExist?.image}`);
  return true;
};

export const toggleBlogStatusService = async (id: string) => {
  const isExist = await Blog.findById(id);
  if (!isExist) throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');

  const result = await Blog.findByIdAndUpdate(id, {
    isActive: !isExist.isActive,
  });
  return result;
};

export const getBlogCountService = async () => {
  const totalBlogs = await Blog.countDocuments();
  return { totalBlogs };
};
