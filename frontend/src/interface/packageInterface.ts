export type IPackage = {
  _id: string;
  title: string;
  slug: string;
  services: string[];
  price: number;
  isPopular: boolean;
  isFeatured: boolean;
  thumbnail?: string;
  description?: string;
  order?: number;

  createdAt: string;
  updatedAt: string;
};
