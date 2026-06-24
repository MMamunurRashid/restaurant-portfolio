export type IDiningTable = {
  tableNumber: string;
  capacity: number;
  area?: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
