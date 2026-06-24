import { useEffect, useState, type FormEvent } from "react";
import {
  Ban,
  CalendarClock,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import type { TResponse } from "@/interface/globalInterface";
import type {
  IReservationBlackoutDate,
  IReservationDayHours,
  IReservationSetting,
  TReservationWeekday,
} from "@/interface/reservationSettingInterface";
import {
  useGetReservationSettingQuery,
  useUpdateReservationSettingMutation,
} from "@/redux/features/reservationSetting/reservationSettingApi";

const WEEKDAYS: Array<{ label: string; value: TReservationWeekday }> = [
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
];

const defaultWeeklyHours = (): IReservationDayHours[] =>
  WEEKDAYS.map((day) => ({
    day: day.value,
    isOpen: true,
    openTime: "11:00",
    closeTime: "22:00",
  }));

const defaultForm = (): IReservationSetting => ({
  isActive: true,
  slotIntervalMinutes: 30,
  maxGuestsPerSlot: 20,
  minGuestCount: 1,
  maxGuestCount: 20,
  advanceBookingDays: 30,
  cutoffHours: 2,
  weeklyHours: defaultWeeklyHours(),
  blackoutDates: [],
});

const getErrorMessage = (res: TResponse) =>
  Array.isArray(res?.error?.data?.error) && res.error.data.error.length > 0
    ? `${res.error.data.error[0]?.path || ""} ${
        res.error.data.error[0]?.message || ""
      }`.trim()
    : res?.error?.data?.message || "Something went wrong!";

const normalizeDate = (date?: string) => (date ? date.slice(0, 10) : "");

export default function ReservationSettings() {
  const [form, setForm] = useState<IReservationSetting>(defaultForm);
  const [newBlackout, setNewBlackout] = useState<IReservationBlackoutDate>({
    date: "",
    reason: "",
  });

  const { data, isLoading, isFetching } = useGetReservationSettingQuery({});
  const [updateReservationSetting, { isLoading: isUpdating }] =
    useUpdateReservationSettingMutation();

  useEffect(() => {
    const setting = data?.data as IReservationSetting | undefined;
    if (!setting) return;

    setForm({
      ...defaultForm(),
      ...setting,
      blackoutDates:
        setting.blackoutDates?.map((item) => ({
          date: normalizeDate(item.date),
          reason: item.reason || "",
        })) || [],
      weeklyHours: setting.weeklyHours?.length
        ? setting.weeklyHours
        : defaultWeeklyHours(),
    });
  }, [data]);

  const updateField = <K extends keyof IReservationSetting>(
    key: K,
    value: IReservationSetting[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateDay = (
    day: TReservationWeekday,
    key: keyof IReservationDayHours,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      weeklyHours: prev.weeklyHours.map((item) =>
        item.day === day ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addBlackoutDate = () => {
    if (!newBlackout.date) {
      toast.error("Select a blackout date first");
      return;
    }

    setForm((prev) => ({
      ...prev,
      blackoutDates: [
        ...(prev.blackoutDates || []).filter(
          (item) => normalizeDate(item.date) !== newBlackout.date,
        ),
        {
          date: newBlackout.date,
          reason: newBlackout.reason?.trim(),
        },
      ],
    }));
    setNewBlackout({ date: "", reason: "" });
  };

  const removeBlackoutDate = (date: string) => {
    setForm((prev) => ({
      ...prev,
      blackoutDates: (prev.blackoutDates || []).filter(
        (item) => normalizeDate(item.date) !== date,
      ),
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: IReservationSetting = {
      ...form,
      slotIntervalMinutes: Number(form.slotIntervalMinutes),
      maxGuestsPerSlot: Number(form.maxGuestsPerSlot),
      minGuestCount: Number(form.minGuestCount),
      maxGuestCount: Number(form.maxGuestCount),
      advanceBookingDays: Number(form.advanceBookingDays),
      cutoffHours: Number(form.cutoffHours),
      blackoutDates: (form.blackoutDates || []).filter((item) => item.date),
    };

    const res = (await updateReservationSetting(payload)) as TResponse;

    if (res?.data?.success) {
      toast.success("Reservation settings saved successfully");
      return;
    }

    toast.error(getErrorMessage(res));
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center font-bold text-muted-foreground animate-pulse">
        Loading reservation settings...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <CalendarClock size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral">
              Reservation Settings
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Control booking hours, guest capacity, and unavailable dates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-secondary">
            <CheckCircle2 size={13} />
            {form.source === "database" ? "Dashboard Config" : "Default Config"}
          </span>
          <button
            type="submit"
            disabled={isUpdating || isFetching}
            className="admin_primary_btn min-w-40 justify-center"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isUpdating ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="space-y-5 rounded-2xl border border-border bg-white p-8 shadow-sm lg:col-span-5">
          <h2 className="flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-neutral">
            <Users size={18} className="text-primary" />
            Capacity Rules
          </h2>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 p-4">
            <span>
              <span className="block text-sm font-bold text-neutral">
                Enable Online Reservation
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                If disabled, guests cannot select a slot.
              </span>
            </span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={form.isActive}
              onChange={(event) => updateField("isActive", event.target.checked)}
            />
          </label>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <NumberField
              label="Slot Interval"
              suffix="minutes"
              value={form.slotIntervalMinutes}
              min={15}
              max={180}
              onChange={(value) => updateField("slotIntervalMinutes", value)}
            />
            <NumberField
              label="Max Guests Per Slot"
              suffix="guests"
              value={form.maxGuestsPerSlot}
              min={1}
              max={500}
              onChange={(value) => updateField("maxGuestsPerSlot", value)}
            />
            <NumberField
              label="Minimum Party Size"
              suffix="guests"
              value={form.minGuestCount}
              min={1}
              max={500}
              onChange={(value) => updateField("minGuestCount", value)}
            />
            <NumberField
              label="Maximum Party Size"
              suffix="guests"
              value={form.maxGuestCount}
              min={1}
              max={500}
              onChange={(value) => updateField("maxGuestCount", value)}
            />
            <NumberField
              label="Advance Booking"
              suffix="days"
              value={form.advanceBookingDays}
              min={0}
              max={365}
              onChange={(value) => updateField("advanceBookingDays", value)}
            />
            <NumberField
              label="Booking Cutoff"
              suffix="hours"
              value={form.cutoffHours}
              min={0}
              max={168}
              onChange={(value) => updateField("cutoffHours", value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-8 shadow-sm lg:col-span-7">
          <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-neutral">
            <Clock size={18} className="text-primary" />
            Weekly Reservation Hours
          </h2>

          <div className="space-y-3">
            {WEEKDAYS.map((day) => {
              const item =
                form.weeklyHours.find((entry) => entry.day === day.value) ||
                defaultWeeklyHours().find((entry) => entry.day === day.value)!;

              return (
                <div
                  key={day.value}
                  className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-[120px_1fr_1fr_110px]"
                >
                  <span className="text-sm font-bold text-neutral">{day.label}</span>
                  <input
                    type="time"
                    value={item.openTime}
                    disabled={!item.isOpen}
                    onChange={(event) =>
                      updateDay(day.value, "openTime", event.target.value)
                    }
                  />
                  <input
                    type="time"
                    value={item.closeTime}
                    disabled={!item.isOpen}
                    onChange={(event) =>
                      updateDay(day.value, "closeTime", event.target.value)
                    }
                  />
                  <label className="flex items-center justify-end gap-2 text-xs font-bold text-slate-500">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                      checked={item.isOpen}
                      onChange={(event) =>
                        updateDay(day.value, "isOpen", event.target.checked)
                      }
                    />
                    Open
                  </label>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-neutral">
          <Ban size={18} className="text-primary" />
          Blackout Dates
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr_auto]">
          <input
            type="date"
            value={newBlackout.date}
            onChange={(event) =>
              setNewBlackout((prev) => ({ ...prev, date: event.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Reason, e.g. private event or holiday"
            value={newBlackout.reason || ""}
            onChange={(event) =>
              setNewBlackout((prev) => ({ ...prev, reason: event.target.value }))
            }
          />
          <button
            type="button"
            onClick={addBlackoutDate}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800"
          >
            <Plus size={16} />
            Add Date
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(form.blackoutDates || []).length > 0 ? (
            form.blackoutDates?.map((item) => (
              <div
                key={normalizeDate(item.date)}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div>
                  <p className="text-sm font-bold text-neutral">
                    {normalizeDate(item.date)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.reason || "Closed for reservation"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeBlackoutDate(normalizeDate(item.date))}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:border-destructive hover:text-destructive"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              No blackout dates added.
            </p>
          )}
        </div>
      </section>
    </form>
  );
}

function NumberField({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label>{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="pr-20"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}
