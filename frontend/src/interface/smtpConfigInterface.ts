export interface ISmtpConfig {
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  mailAdminTo?: string;
  isActive?: boolean;
}

export interface ISmtpConfigResponse extends Omit<ISmtpConfig, "smtpPass"> {
  hasSmtpPass: boolean;
  source: "database" | "none";
}
