export type TReservationWeekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type IReservationDayHours = {
  day: TReservationWeekday;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type IReservationBlackoutDate = {
  date: Date;
  reason?: string;
};

export type IReservationSetting = {
  isActive: boolean;
  slotIntervalMinutes: number;
  maxGuestsPerSlot: number;
  minGuestCount: number;
  maxGuestCount: number;
  advanceBookingDays: number;
  cutoffHours: number;
  weeklyHours: IReservationDayHours[];
  blackoutDates?: IReservationBlackoutDate[];
  createdAt?: Date;
  updatedAt?: Date;
};
