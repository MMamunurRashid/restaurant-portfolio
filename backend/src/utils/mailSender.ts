import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import { SmtpConfig } from '../modules/smtpConfig/smtpConfigModel';

type MailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

let transporter: Transporter | null = null;
let transporterKey = '';

const splitRecipients = (value?: string) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const isSslPort = (port?: number) => Number(port) === 465;

type RuntimeMailConfig = {
  smtpHost?: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  mailAdminTo?: string;
  isActive: boolean;
};

const getRuntimeMailConfig = async (): Promise<RuntimeMailConfig> => {
  const dbConfig = await SmtpConfig.findOne({}).select('+smtpPass').lean();

  if (!dbConfig) {
    return {
      smtpPort: 587,
      smtpSecure: false,
      isActive: false,
    };
  }

  return {
    smtpHost: dbConfig.smtpHost,
    smtpPort: dbConfig.smtpPort || 587,
    smtpSecure: isSslPort(dbConfig.smtpPort),
    smtpUser: dbConfig.smtpUser,
    smtpPass: dbConfig.smtpPass,
    smtpFromEmail: dbConfig.smtpFromEmail,
    smtpFromName: dbConfig.smtpFromName,
    mailAdminTo: dbConfig.mailAdminTo,
    isActive: dbConfig.isActive !== false,
  };
};

export const getAdminRecipients = async () => {
  const runtimeConfig = await getRuntimeMailConfig();
  return splitRecipients(runtimeConfig.mailAdminTo);
};

const isMailConfigured = (runtimeConfig: RuntimeMailConfig) =>
  Boolean(
    runtimeConfig.isActive &&
      runtimeConfig.smtpHost &&
      runtimeConfig.smtpPort &&
      runtimeConfig.smtpUser &&
      runtimeConfig.smtpPass &&
      (runtimeConfig.smtpFromEmail || runtimeConfig.smtpUser),
  );

const getTransporter = (runtimeConfig: RuntimeMailConfig) => {
  const nextKey = [
    runtimeConfig.smtpHost,
    runtimeConfig.smtpPort,
    runtimeConfig.smtpSecure,
    runtimeConfig.smtpUser,
    runtimeConfig.smtpPass,
  ].join('|');

  if (!transporter || transporterKey !== nextKey) {
    transporter = nodemailer.createTransport({
      host: runtimeConfig.smtpHost,
      port: runtimeConfig.smtpPort,
      secure: runtimeConfig.smtpSecure,
      auth: {
        user: runtimeConfig.smtpUser,
        pass: runtimeConfig.smtpPass,
      },
    });
    transporterKey = nextKey;
  }

  return transporter;
};

const getFromAddress = (runtimeConfig: RuntimeMailConfig) => {
  const fromEmail = runtimeConfig.smtpFromEmail || runtimeConfig.smtpUser;
  const fromName = String(runtimeConfig.smtpFromName || '').replace(/"/g, "'");

  return fromName && fromEmail ? `"${fromName}" <${fromEmail}>` : fromEmail;
};

export const sendMail = async (payload: MailPayload) => {
  const recipients = Array.isArray(payload.to)
    ? payload.to.filter(Boolean)
    : splitRecipients(payload.to);

  if (!recipients.length) {
    console.warn('[mail] No mail recipient configured.');
    return false;
  }

  const runtimeConfig = await getRuntimeMailConfig();

  if (!isMailConfigured(runtimeConfig)) {
    console.warn('[mail] SMTP is not configured. Mail skipped.');
    return false;
  }

  const options: SendMailOptions = {
    from: getFromAddress(runtimeConfig),
    to: recipients,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
  };

  await getTransporter(runtimeConfig).sendMail(options);
  return true;
};
