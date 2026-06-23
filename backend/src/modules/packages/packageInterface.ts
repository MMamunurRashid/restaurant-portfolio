
export type IPackage = {
  title: string;
  slug: string;
  services: string[];
  price: number;
  isPopular: boolean;
  isFeatured: boolean;
  thumbnail?: string;
  description?: string;
  order?: number;
};
