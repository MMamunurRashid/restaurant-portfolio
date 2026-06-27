import { NextFunction, Request, Response } from 'express';
import { connectDB } from '../DB/connect';

export const ensureDatabaseConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};
