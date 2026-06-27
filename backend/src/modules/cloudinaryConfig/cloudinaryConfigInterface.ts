export type ICloudinaryConfig = {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  folder?: string;
  isActive?: boolean;
};

export type ICloudinaryConfigResponse = Omit<
  ICloudinaryConfig,
  'apiSecret'
> & {
  hasApiSecret: boolean;
  source: 'database' | 'none';
};
