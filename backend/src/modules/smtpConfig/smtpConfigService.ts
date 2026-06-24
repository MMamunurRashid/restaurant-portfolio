import {
  ISmtpConfig,
  ISmtpConfigResponse,
} from './smtpConfigInterface';
import { SmtpConfig } from './smtpConfigModel';

const toBoolean = (value: unknown) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return Boolean(value);
};

const isSslPort = (port?: number) => Number(port) === 465;

const normalizePayload = (payload: ISmtpConfig) => {
  const data: ISmtpConfig = {
    ...payload,
    smtpPort:
      payload.smtpPort === undefined ? undefined : Number(payload.smtpPort),
  };

  if (data.smtpPort !== undefined) {
    data.smtpSecure = isSslPort(data.smtpPort);
  }

  if (payload.isActive !== undefined) {
    data.isActive = toBoolean(payload.isActive);
  }

  if (!payload.smtpPass?.trim()) {
    delete data.smtpPass;
  }

  if (data.smtpFromEmail === '') delete data.smtpFromEmail;

  Object.keys(data).forEach((key) => {
    if (data[key as keyof ISmtpConfig] === undefined) {
      delete data[key as keyof ISmtpConfig];
    }
  });

  return data;
};

const toResponse = (
  payload: ISmtpConfig | null,
  source: 'database' | 'none',
): ISmtpConfigResponse => ({
  smtpHost: payload?.smtpHost,
  smtpPort: payload?.smtpPort || 587,
  smtpSecure: isSslPort(payload?.smtpPort || 587),
  smtpUser: payload?.smtpUser,
  smtpFromEmail: payload?.smtpFromEmail,
  smtpFromName: payload?.smtpFromName || 'Prestige Cafe & Restaurant',
  mailAdminTo: payload?.mailAdminTo,
  isActive: source === 'database' ? payload?.isActive ?? true : false,
  hasSmtpPass: Boolean(payload?.smtpPass),
  source,
});

export const getSmtpConfigService = async () => {
  const dbConfig = await SmtpConfig.findOne({}).select('+smtpPass').lean();

  if (dbConfig) {
    return toResponse(dbConfig, 'database');
  }

  return toResponse(null, 'none');
};

export const updateSmtpConfigService = async (payload: ISmtpConfig) => {
  const data = normalizePayload(payload);
  const existing = await SmtpConfig.findOne({}).select('+smtpPass');

  if (!existing) {
    if (data.smtpPort === undefined) data.smtpPort = 587;
    data.smtpSecure = isSslPort(data.smtpPort);
    const result = await SmtpConfig.create(data);
    return toResponse(result.toObject(), 'database');
  }

  Object.assign(existing, data);
  existing.smtpSecure = isSslPort(existing.smtpPort);
  const result = await existing.save();

  return toResponse(result.toObject(), 'database');
};
