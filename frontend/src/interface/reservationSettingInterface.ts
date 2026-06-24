export type TReservationWeekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type IReservationDayHours = {
  day: TReservationWeekday;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type IReservationBlackoutDate = {
  date: string;
  reason?: string;
};

export type IReservationSetting = {
  _id?: string;
  isActive: boolean;
  slotIntervalMinutes: number;
  maxGuestsPerSlot: number;
  minGuestCount: number;
  maxGuestCount: number;
  advanceBookingDays: number;
  cutoffHours: number;
  weeklyHours: IReservationDayHours[];
  blackoutDates?: IReservationBlackoutDate[];
  source?: "database" | "default";
};

export type IReservationSlot = {
  time: string;
  label: string;
  available: boolean;
  bookedGuests: number;
  remainingGuests: number;
  capacity: number;
  disabledReason?: string;
};

export type IAvailableReservationSlots = {
  date: string;
  guestCount: number;
  slots: IReservationSlot[];
  reason?: string;
  setting: Pick<
    IReservationSetting,
    | "isActive"
    | "slotIntervalMinutes"
    | "maxGuestsPerSlot"
    | "minGuestCount"
    | "maxGuestCount"
    | "advanceBookingDays"
    | "cutoffHours"
  >;
};
