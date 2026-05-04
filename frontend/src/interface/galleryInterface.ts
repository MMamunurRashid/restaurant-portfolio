export type IGalleryImage = {
  title: string;
  image: string;
};

export type IGallery = {
  title: string;
  images: IGalleryImage[];
  isActive?: boolean;
  order?: number;
};
