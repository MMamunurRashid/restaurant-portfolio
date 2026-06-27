export interface ICloudinaryConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  folder?: string;
  isActive?: boolean;
}

export interface ICloudinaryConfigResponse
  extends Omit<ICloudinaryConfig, "apiSecret"> {
  hasApiSecret: boolean;
  source: "database" | "none";
}
