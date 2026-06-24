import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Appointment } from '../appointment/appointmentModel';
import {
  IReservationBlackoutDate,
  IReservationDayHours,
  IReservationSetting,
  TReservationWeekday,
} from './reservationSettingInterface';
import { ReservationSetting } from './reservationSettingModel';

const WEEKDAYS: TReservationWeekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const DEFAULT_WEEKLY_HOURS: IReservationDayHours[] = WEEKDAYS.map((day) => ({
  day,
  isOpen: true,
  openTime: '11:00',
  closeTime: '22:00',
}));

const defaultSetting = (): IReservationSetting => ({
  isActive: true,
  slotIntervalMinutes: 30,
  maxGuestsPerSlot: 20,
  minGuestCount: 1,
  maxGuestCount: 20,
  advanceBookingDays: 30,
  cutoffHours: 2,
  weeklyHours: DEFAULT_WEEKLY_HOURS.map((item) => ({ ...item })),
  blackoutDates: [],
});

const toBoolean = (value: unknown) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return Boolean(value);
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const formatSlotLabel = (time: string) => {
  const [hourText, minuteText = '00'] = time.split(':');
  const hour = Number(hourText);
  if (Number.isNaN(hour)) return time;

  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${minuteText.padStart(2, '0')} ${suffix}`;
};

const normalizeDateOnly = (value: unknown) => {
  const text =
    value instanceof Date ? value.toISOString().slice(0, 10) : String(value || '').slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Valid reservation date is required');
  }

  return text;
};

const localDateOnly = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const utcDateRange = (dateOnly: string) => ({
  start: new Date(`${dateOnly}T00:00:00.000Z`),
  end: new Date(`${dateOnly}T23:59:59.999Z`),
});

const dayOfWeek = (dateOnly: string): TReservationWeekday => {
  const dayIndex = new Date(`${dateOnly}T12:00:00.000Z`).getUTCDay();
  return WEEKDAYS[dayIndex];
};

const normalizeBlackoutDate = (
  item: IReservationBlackoutDate | { date: string; reason?: string },
): IReservationBlackoutDate => ({
  date: new Date(`${normalizeDateOnly(item.date)}T00:00:00.000Z`),
  reason: item.reason?.trim(),
});

const normalizeWeeklyHours = (weeklyHours: IReservationDayHours[]) => {
  const byDay = new Map<TReservationWeekday, IReservationDayHours>();

  weeklyHours.forEach((item) => {
    if (toMinutes(item.openTime) >= toMinutes(item.closeTime)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${item.day} close time must be after open time`,
      );
    }

    byDay.set(item.day, {
      day: item.day,
      isOpen: toBoolean(item.isOpen),
      openTime: item.openTime,
      closeTime: item.closeTime,
    });
  });

  return WEEKDAYS.map(
    (day) =>
      byDay.get(day) ||
      DEFAULT_WEEKLY_HOURS.find((item) => item.day === day)!,
  ).map((item) => ({ ...item }));
};

const normalizePayload = (payload: Partial<IReservationSetting>) => {
  const data: Partial<IReservationSetting> = {};

  if (payload.isActive !== undefined) data.isActive = toBoolean(payload.isActive);
  if (payload.slotIntervalMinutes !== undefined) {
    data.slotIntervalMinutes = Number(payload.slotIntervalMinutes);
  }
  if (payload.maxGuestsPerSlot !== undefined) {
    data.maxGuestsPerSlot = Number(payload.maxGuestsPerSlot);
  }
  if (payload.minGuestCount !== undefined) {
    data.minGuestCount = Number(payload.minGuestCount);
  }
  if (payload.maxGuestCount !== undefined) {
    data.maxGuestCount = Number(payload.maxGuestCount);
  }
  if (payload.advanceBookingDays !== undefined) {
    data.advanceBookingDays = Number(payload.advanceBookingDays);
  }
  if (payload.cutoffHours !== undefined) data.cutoffHours = Number(payload.cutoffHours);
  if (payload.weeklyHours) data.weeklyHours = normalizeWeeklyHours(payload.weeklyHours);
  if (payload.blackoutDates) {
    data.blackoutDates = payload.blackoutDates.map((item) =>
      normalizeBlackoutDate(item),
    );
  }

  return data;
};

const mergeWithDefaults = (
  payload?: Partial<IReservationSetting> | null,
): IReservationSetting => {
  const fallback = defaultSetting();
  return {
    ...fallback,
    ...payload,
    weeklyHours: payload?.weeklyHours?.length
      ? normalizeWeeklyHours(payload.weeklyHours)
      : fallback.weeklyHours,
    blackoutDates: payload?.blackoutDates || [],
  };
};

const getEffectiveSetting = async () => {
  const setting = await ReservationSetting.findOne({}).lean();
  return mergeWithDefaults(setting);
};

const blackoutReason = (
  setting: IReservationSetting,
  dateOnly: string,
) => {
  const match = setting.blackoutDates?.find(
    (item) => item.date.toISOString().slice(0, 10) === dateOnly,
  );

  return match ? match.reason || 'Reservations are closed for this date' : '';
};

const dateWindowReason = (setting: IReservationSetting, dateOnly: string) => {
  const today = localDateOnly();
  if (dateOnly < today) return 'Past dates are not available for reservation';

  const maxDate = new Date();
  maxDate.setHours(0, 0, 0, 0);
  maxDate.setDate(maxDate.getDate() + setting.advanceBookingDays);

  if (dateOnly > localDateOnly(maxDate)) {
    return `Reservations are available up to ${setting.advanceBookingDays} days ahead`;
  }

  return '';
};

const slotCutoffReason = (
  setting: IReservationSetting,
  dateOnly: string,
  time: string,
) => {
  const slotDateTime = new Date(`${dateOnly}T${time}:00`);
  const cutoffTime = Date.now() + setting.cutoffHours * 60 * 60 * 1000;

  if (slotDateTime.getTime() < cutoffTime) {
    return `This slot is inside the ${setting.cutoffHours} hour booking cutoff`;
  }

  return '';
};

const getBookedGuestsByTime = async (dateOnly: string) => {
  const { start, end } = utcDateRange(dateOnly);
  const rows = await Appointment.aggregate<{
    _id: string;
    bookedGuests: number;
    reservations: number;
  }>([
    {
      $match: {
        date: { $gte: start, $lte: end },
        time: { $type: 'string', $ne: '' },
        $or: [
          { status: { $in: ['pending', 'confirmed'] } },
          { status: { $exists: false } },
        ],
      },
    },
    {
      $group: {
        _id: '$time',
        bookedGuests: { $sum: { $ifNull: ['$guestCount', 2] } },
        reservations: { $sum: 1 },
      },
    },
  ]);

  return new Map(rows.map((row) => [row._id, row]));
};

export const getReservationSettingService = async () => {
  const existing = await ReservationSetting.findOne({}).lean();
  return {
    ...mergeWithDefaults(existing),
    source: existing ? 'database' : 'default',
  };
};

export const updateReservationSettingService = async (
  payload: Partial<IReservationSetting>,
) => {
  const existing = await ReservationSetting.findOne({});
  const data = normalizePayload(payload);
  const current = mergeWithDefaults(existing?.toObject());
  const next = { ...current, ...data };

  if (next.minGuestCount > next.maxGuestCount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Minimum guest count cannot be greater than maximum guest count',
    );
  }

  if (next.maxGuestCount > next.maxGuestsPerSlot) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Maximum guest count cannot be greater than max guests per slot',
    );
  }

  if (!existing) {
    const result = await ReservationSetting.create(next);
    return { ...result.toObject(), source: 'database' };
  }

  Object.assign(existing, data);
  const result = await existing.save();
  return { ...mergeWithDefaults(result.toObject()), source: 'database' };
};

export const getAvailableReservationSlotsService = async (
  query: Record<string, unknown>,
) => {
  const dateOnly = normalizeDateOnly(query.date);
  const guestCount = Math.max(1, Number(query.guestCount) || 1);
  const setting = await getEffectiveSetting();

  const baseResponse = {
    date: dateOnly,
    guestCount,
    slots: [] as Array<{
      time: string;
      label: string;
      available: boolean;
      bookedGuests: number;
      remainingGuests: number;
      capacity: number;
      disabledReason?: string;
    }>,
    setting: {
      isActive: setting.isActive,
      slotIntervalMinutes: setting.slotIntervalMinutes,
      maxGuestsPerSlot: setting.maxGuestsPerSlot,
      minGuestCount: setting.minGuestCount,
      maxGuestCount: setting.maxGuestCount,
      advanceBookingDays: setting.advanceBookingDays,
      cutoffHours: setting.cutoffHours,
    },
    reason: '',
  };

  if (!setting.isActive) {
    return { ...baseResponse, reason: 'Online reservations are disabled' };
  }

  if (guestCount < setting.minGuestCount || guestCount > setting.maxGuestCount) {
    return {
      ...baseResponse,
      reason: `Guest count must be between ${setting.minGuestCount} and ${setting.maxGuestCount}`,
    };
  }

  const windowReason = dateWindowReason(setting, dateOnly);
  if (windowReason) return { ...baseResponse, reason: windowReason };

  const closedReason = blackoutReason(setting, dateOnly);
  if (closedReason) return { ...baseResponse, reason: closedReason };

  const dayHours = setting.weeklyHours.find(
    (item) => item.day === dayOfWeek(dateOnly),
  );

  if (!dayHours?.isOpen) {
    return { ...baseResponse, reason: 'Reservations are closed on this day' };
  }

  const bookedByTime = await getBookedGuestsByTime(dateOnly);
  const openMinute = toMinutes(dayHours.openTime);
  const closeMinute = toMinutes(dayHours.closeTime);

  for (
    let minute = openMinute;
    minute < closeMinute;
    minute += setting.slotIntervalMinutes
  ) {
    const time = formatMinutes(minute);
    const booked = bookedByTime.get(time)?.bookedGuests || 0;
    const remaining = Math.max(setting.maxGuestsPerSlot - booked, 0);
    const cutoffReason = slotCutoffReason(setting, dateOnly, time);
    const capacityReason =
      remaining < guestCount
        ? `Only ${remaining} guest${remaining === 1 ? '' : 's'} left for this slot`
        : '';

    baseResponse.slots.push({
      time,
      label: formatSlotLabel(time),
      available: !cutoffReason && !capacityReason,
      bookedGuests: booked,
      remainingGuests: remaining,
      capacity: setting.maxGuestsPerSlot,
      disabledReason: cutoffReason || capacityReason || undefined,
    });
  }

  if (!baseResponse.slots.some((slot) => slot.available)) {
    baseResponse.reason = 'No available slots for this date and guest count';
  }

  return baseResponse;
};

export const assertAppointmentSlotAvailable = async (
  appointment: Partial<{
    date: Date | string;
    time: string;
    guestCount: number;
  }>,
) => {
  const availability = await getAvailableReservationSlotsService({
    date: appointment.date,
    guestCount: appointment.guestCount,
  });

  if (!appointment.time) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Reservation time is required');
  }

  if (!availability.slots.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      availability.reason || 'No reservation slots are available',
    );
  }

  const selectedSlot = availability.slots.find(
    (slot) => slot.time === appointment.time,
  );

  if (!selectedSlot) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Selected time is outside reservation hours',
    );
  }

  if (!selectedSlot.available) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      selectedSlot.disabledReason || 'Selected slot is not available',
    );
  }
};
