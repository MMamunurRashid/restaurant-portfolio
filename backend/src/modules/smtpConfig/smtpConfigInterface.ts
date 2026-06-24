export type ISmtpConfig = {
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  mailAdminTo?: string;
  isActive?: boolean;
};

export type ISmtpConfigResponse = Omit<ISmtpConfig, 'smtpPass'> & {
  hasSmtpPass: boolean;
  source: 'database' | 'none';
};
