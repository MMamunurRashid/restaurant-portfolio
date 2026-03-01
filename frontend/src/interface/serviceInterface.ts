export type IService = {
  _id: string;
  thumbnail: string;
  galleries?: string[];
  icon: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
};
