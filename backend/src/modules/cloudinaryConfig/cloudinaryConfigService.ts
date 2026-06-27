import {
  ICloudinaryConfig,
  ICloudinaryConfigResponse,
} from './cloudinaryConfigInterface';
import { CloudinaryConfig } from './cloudinaryConfigModel';

const toBoolean = (value: unknown) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return Boolean(value);
};

const normalizeFolder = (folder?: string) =>
  folder
    ?.trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

const normalizePayload = (payload: ICloudinaryConfig) => {
  const data: ICloudinaryConfig = {
    ...payload,
    cloudName: payload.cloudName?.trim(),
    apiKey: payload.apiKey?.trim(),
    folder: normalizeFolder(payload.folder),
  };

  if (payload.isActive !== undefined) {
    data.isActive = toBoolean(payload.isActive);
  }

  if (!payload.apiSecret?.trim()) {
    delete data.apiSecret;
  } else {
    data.apiSecret = payload.apiSecret.trim();
  }

  Object.keys(data).forEach((key) => {
    const value = data[key as keyof ICloudinaryConfig];
    if (value === undefined || value === '') {
      delete data[key as keyof ICloudinaryConfig];
    }
  });

  return data;
};

const toResponse = (
  payload: ICloudinaryConfig | null,
  source: 'database' | 'none',
): ICloudinaryConfigResponse => ({
  cloudName: payload?.cloudName,
  apiKey: payload?.apiKey,
  folder: payload?.folder || 'foodie-cafe',
  isActive: source === 'database' ? payload?.isActive ?? true : false,
  hasApiSecret: Boolean(payload?.apiSecret),
  source,
});

export const getCloudinaryConfigService = async () => {
  const dbConfig = await CloudinaryConfig.findOne({})
    .select('+apiSecret')
    .lean();

  if (dbConfig) {
    return toResponse(dbConfig, 'database');
  }

  return toResponse(null, 'none');
};

export const updateCloudinaryConfigService = async (
  payload: ICloudinaryConfig,
) => {
  const data = normalizePayload(payload);
  const existing = await CloudinaryConfig.findOne({}).select('+apiSecret');

  if (!existing) {
    if (!data.folder) data.folder = 'foodie-cafe';
    const result = await CloudinaryConfig.create(data);
    return toResponse(result.toObject(), 'database');
  }

  Object.assign(existing, data);
  const result = await existing.save();

  return toResponse(result.toObject(), 'database');
};
