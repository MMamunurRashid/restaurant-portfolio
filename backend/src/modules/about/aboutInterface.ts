export type IAbout = {
  image: string;
  title: string;
  subTitle: string;
  description: string;
  stats?: {
    count: string;
    title: string;
  }[];
};
