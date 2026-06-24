import config from '../config';
import { IAppointment } from '../modules/appointment/appointmentInterface';
import { IMessage } from '../modules/message/messageInterface';
import { getAdminRecipients, sendMail } from './mailSender';

type MailContent = {
  subject: string;
  html: string;
  text: string;
};

type PopulatedPackage = {
  title?: string;
  price?: number;
  services?: string[];
};

type ReservationMailData = Omit<IAppointment, 'packages'> & {
  _id?: unknown;
  packages?: unknown[];
};

const brand = {
  name: 'Prestige Cafe & Restaurant',
  primary: '#7da61a',
  secondary: '#d0a455',
  neutral: '#211e1f',
  muted: '#f6f8fa',
  border: '#e7e1d6',
};

const escapeHtml = (value?: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const plain = (value?: unknown, fallback = 'Not provided') => {
  const text = String(value ?? '').trim();
  return text || fallback;
};

const display = (value?: unknown, fallback = 'Not provided') =>
  escapeHtml(plain(value, fallback));

const isValidEmail = (email?: string) =>
  Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

const formatDate = (date?: Date | string) => {
  if (!date) return 'Not provided';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);

  return new Intl.DateTimeFormat('en-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
};

const formatTime = (time?: string) => {
  if (!time) return 'Not provided';
  const [hourText, minuteText = '00'] = time.split(':');
  const hour = Number(hourText);

  if (Number.isNaN(hour)) return time;

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minuteText.padStart(2, '0')} ${suffix}`;
};

const formatMoney = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Not provided';
  return `BDT ${value.toLocaleString('en-BD')}`;
};

const dashboardUrl = (path: string) => {
  if (!config.FRONTEND_URL) return '';
  return `${config.FRONTEND_URL.replace(/\/+$/, '')}${path}`;
};

const detailsRows = (rows: Array<[string, unknown]>) =>
  rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid ${brand.border};color:#777;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:160px;">${escapeHtml(label)}</td>
          <td style="padding:12px 0;border-bottom:1px solid ${brand.border};color:${brand.neutral};font-size:14px;font-weight:700;">${display(value)}</td>
        </tr>
      `,
    )
    .join('');

const ctaButton = (label: string, href: string) =>
  href
    ? `
      <a href="${escapeHtml(href)}" style="display:inline-block;margin-top:22px;background:${brand.primary};color:#ffffff;text-decoration:none;padding:13px 18px;border-radius:10px;font-size:13px;font-weight:800;letter-spacing:.02em;">
        ${escapeHtml(label)}
      </a>
    `
    : '';

const emailLayout = ({
  badge,
  title,
  intro,
  children,
}: {
  badge: string;
  title: string;
  intro: string;
  children: string;
}) => `
  <!doctype html>
  <html>
    <body style="margin:0;background:${brand.muted};font-family:Arial,Helvetica,sans-serif;color:${brand.neutral};">
      <div style="padding:28px 12px;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid ${brand.border};border-radius:18px;overflow:hidden;box-shadow:0 14px 38px rgba(33,30,31,.08);">
          <div style="background:${brand.neutral};padding:28px 30px;color:#ffffff;">
            <div style="display:inline-block;border:1px solid rgba(208,164,85,.45);background:rgba(208,164,85,.14);color:${brand.secondary};padding:7px 10px;border-radius:999px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;">
              ${escapeHtml(badge)}
            </div>
            <h1 style="margin:18px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;font-weight:400;">
              ${escapeHtml(title)}
            </h1>
            <p style="margin:0;color:rgba(255,255,255,.72);font-size:14px;line-height:1.7;">
              ${escapeHtml(intro)}
            </p>
          </div>

          <div style="padding:30px;">
            ${children}
          </div>

          <div style="padding:18px 30px;background:${brand.muted};border-top:1px solid ${brand.border};">
            <p style="margin:0;color:#777;font-size:12px;line-height:1.6;">
              This email was sent by ${escapeHtml(brand.name)} website automation.
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

const messageBox = (message: string) => `
  <div style="margin-top:22px;padding:18px;border-left:4px solid ${brand.primary};background:${brand.muted};border-radius:12px;">
    <p style="margin:0;color:${brand.neutral};font-size:15px;line-height:1.8;white-space:pre-line;">${display(message)}</p>
  </div>
`;

const getPackages = (appointment: ReservationMailData): PopulatedPackage[] =>
  (appointment.packages || []).filter((item): item is PopulatedPackage => {
    if (!item || typeof item !== 'object') return false;
    return 'title' in item || 'price' in item;
  });

const packageTable = (packages: PopulatedPackage[]) => {
  if (!packages.length) {
    return `
      <p style="margin:0;padding:16px;background:${brand.muted};border-radius:12px;color:#777;font-size:14px;">
        No dining package selected.
      </p>
    `;
  }

  const rows = packages
    .map(
      (pkg) => `
        <tr>
          <td style="padding:13px 0;border-bottom:1px solid ${brand.border};">
            <div style="color:${brand.neutral};font-size:14px;font-weight:800;">${display(pkg.title, 'Dining package')}</div>
            ${
              pkg.services?.length
                ? `<div style="margin-top:4px;color:#777;font-size:12px;line-height:1.5;">${escapeHtml(pkg.services.slice(0, 3).join(', '))}</div>`
                : ''
            }
          </td>
          <td style="padding:13px 0;border-bottom:1px solid ${brand.border};text-align:right;color:${brand.primary};font-size:14px;font-weight:900;">
            ${escapeHtml(formatMoney(pkg.price))}
          </td>
        </tr>
      `,
    )
    .join('');

  const total = packages.reduce(
    (sum, pkg) => sum + (typeof pkg.price === 'number' ? pkg.price : 0),
    0,
  );

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      ${rows}
      ${
        total > 0
          ? `<tr><td style="padding:14px 0 0;color:${brand.neutral};font-size:14px;font-weight:900;">Estimated total</td><td style="padding:14px 0 0;text-align:right;color:${brand.primary};font-size:16px;font-weight:900;">${escapeHtml(formatMoney(total))}</td></tr>`
          : ''
      }
    </table>
  `;
};

const buildAdminQueryMail = (message: IMessage): MailContent => {
  const subject = `New audience query from ${plain(message.name, 'Website visitor')}`;
  const text = [
    'New audience query',
    `Name: ${plain(message.name)}`,
    `Phone: ${plain(message.phone)}`,
    `Email: ${plain(message.email)}`,
    '',
    plain(message.message),
  ].join('\n');

  const html = emailLayout({
    badge: 'New Query',
    title: 'A guest sent a message',
    intro: 'A new audience query has arrived from the website contact form.',
    children: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${detailsRows([
          ['Name', message.name],
          ['Phone', message.phone],
          ['Email', message.email],
        ])}
      </table>
      ${messageBox(message.message)}
      ${ctaButton('Open Messages', dashboardUrl('/admin/contact-message'))}
    `,
  });

  return { subject, html, text };
};

const buildAdminReservationMail = (
  appointment: ReservationMailData,
): MailContent => {
  const packages = getPackages(appointment);
  const subject = `New reservation request from ${plain(appointment.name, 'Guest')}`;
  const text = [
    'New reservation request',
    `Name: ${plain(appointment.name)}`,
    `Phone: ${plain(appointment.phone)}`,
    `Email: ${plain(appointment.email)}`,
    `Date: ${formatDate(appointment.date)}`,
    `Time: ${formatTime(appointment.time)}`,
    `Address: ${plain(appointment.address)}`,
    `Notes: ${plain(appointment.notes)}`,
    '',
    `Packages: ${packages.length ? packages.map((pkg) => `${plain(pkg.title)} (${formatMoney(pkg.price)})`).join(', ') : 'No package selected'}`,
  ].join('\n');

  const html = emailLayout({
    badge: 'New Reservation',
    title: 'A table reservation needs attention',
    intro: 'A guest submitted a new reservation request. Please review and confirm by phone.',
    children: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${detailsRows([
          ['Name', appointment.name],
          ['Phone', appointment.phone],
          ['Email', appointment.email],
          ['Date', formatDate(appointment.date)],
          ['Time', formatTime(appointment.time)],
          ['Address', appointment.address],
          ['Notes', appointment.notes],
        ])}
      </table>

      <h2 style="margin:28px 0 12px;font-size:16px;color:${brand.neutral};">Dining package</h2>
      ${packageTable(packages)}
      ${ctaButton('Open Reservations', dashboardUrl('/admin/appointments/all'))}
    `,
  });

  return { subject, html, text };
};

const buildAudienceReservationMail = (
  appointment: ReservationMailData,
): MailContent => {
  const packages = getPackages(appointment);
  const subject = `We received your reservation request`;
  const text = [
    `Hi ${plain(appointment.name, 'there')},`,
    '',
    `Thanks for choosing ${brand.name}. We received your reservation request and our team will call you to confirm the slot.`,
    '',
    `Date: ${formatDate(appointment.date)}`,
    `Time: ${formatTime(appointment.time)}`,
    `Phone: ${plain(appointment.phone)}`,
    `Packages: ${packages.length ? packages.map((pkg) => `${plain(pkg.title)} (${formatMoney(pkg.price)})`).join(', ') : 'No package selected'}`,
  ].join('\n');

  const html = emailLayout({
    badge: 'Reservation Received',
    title: `Thank you, ${plain(appointment.name, 'Guest')}`,
    intro: 'We received your reservation request. Our team will call you soon to confirm the details.',
    children: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${detailsRows([
          ['Date', formatDate(appointment.date)],
          ['Time', formatTime(appointment.time)],
          ['Phone', appointment.phone],
          ['Address', appointment.address],
          ['Notes', appointment.notes],
        ])}
      </table>

      <h2 style="margin:28px 0 12px;font-size:16px;color:${brand.neutral};">Your selected package</h2>
      ${packageTable(packages)}

      <p style="margin:24px 0 0;color:#777;font-size:14px;line-height:1.8;">
        Please keep your phone reachable. If any detail needs to change, reply to this email or call the restaurant directly.
      </p>
      ${ctaButton('Visit Website', config.FRONTEND_URL || '')}
    `,
  });

  return { subject, html, text };
};

const safeNotify = async (task: () => Promise<unknown>) => {
  try {
    await task();
  } catch (error) {
    console.error('[mail] Failed to send notification', error);
  }
};

export const sendAudienceQueryNotification = async (message: IMessage) =>
  safeNotify(async () => {
    const mail = buildAdminQueryMail(message);
    await sendMail({
      to: await getAdminRecipients(),
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: isValidEmail(message.email) ? message.email : undefined,
    });
  });

export const sendReservationNotifications = async (
  appointment: ReservationMailData,
) =>
  safeNotify(async () => {
    const adminMail = buildAdminReservationMail(appointment);
    await sendMail({
      to: await getAdminRecipients(),
      subject: adminMail.subject,
      html: adminMail.html,
      text: adminMail.text,
      replyTo: isValidEmail(appointment.email) ? appointment.email : undefined,
    });

    if (!isValidEmail(appointment.email)) return;

    const audienceMail = buildAudienceReservationMail(appointment);
    await sendMail({
      to: appointment.email as string,
      subject: audienceMail.subject,
      html: audienceMail.html,
      text: audienceMail.text,
    });
  });
