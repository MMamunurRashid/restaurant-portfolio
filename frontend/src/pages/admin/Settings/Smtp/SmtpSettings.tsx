import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AtSign,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  Save,
  Send,
  Server,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import type { TResponse } from "@/interface/globalInterface";
import type { ISmtpConfig } from "@/interface/smtpConfigInterface";
import {
  useGetSmtpConfigQuery,
  useUpdateSmtpConfigMutation,
} from "@/redux/features/smtpConfig/smtpConfigApi";

type SmtpForm = ISmtpConfig;

const getErrorMessage = (res: TResponse) =>
  Array.isArray(res?.error?.data?.error) && res.error.data.error.length > 0
    ? `${res.error.data.error[0]?.path || ""} ${
        res.error.data.error[0]?.message || ""
      }`.trim()
    : res?.error?.data?.message || "Something went wrong!";

export default function SmtpSettings() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SmtpForm>({
    defaultValues: {
      smtpPort: 587,
      isActive: true,
    },
  });

  const { data, isLoading, isFetching } = useGetSmtpConfigQuery({});
  const smtpConfig = data?.data;
  const [updateSmtpConfig, { isLoading: isUpdating }] =
    useUpdateSmtpConfigMutation();

  useEffect(() => {
    if (!smtpConfig) return;

    reset({
      smtpHost: smtpConfig.smtpHost || "",
      smtpPort: smtpConfig.smtpPort || 587,
      smtpUser: smtpConfig.smtpUser || "",
      smtpPass: "",
      smtpFromEmail: smtpConfig.smtpFromEmail || "",
      smtpFromName: smtpConfig.smtpFromName || "Foodie Cafe & Restaurant",
      mailAdminTo: smtpConfig.mailAdminTo || "",
      isActive: smtpConfig.isActive !== false,
    });
  }, [smtpConfig, reset]);

  const onSubmit = async (form: SmtpForm) => {
    const payload: ISmtpConfig = {
      smtpHost: form.smtpHost?.trim(),
      smtpPort: Number(form.smtpPort) || 587,
      smtpUser: form.smtpUser?.trim(),
      smtpFromEmail: form.smtpFromEmail?.trim(),
      smtpFromName: form.smtpFromName?.trim(),
      mailAdminTo: form.mailAdminTo?.trim(),
      isActive: Boolean(form.isActive),
    };

    if (form.smtpPass?.trim()) {
      payload.smtpPass = form.smtpPass.trim();
    }

    const res = (await updateSmtpConfig(payload)) as TResponse;

    if (res?.data?.success) {
      toast.success("SMTP settings saved successfully");
      reset({
        ...res.data.data,
        smtpPass: "",
      });
      return;
    }

    toast.error(getErrorMessage(res));
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center font-bold text-muted-foreground animate-pulse">
        Loading SMTP settings...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 animate-in fade-in duration-500 pb-10"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral">SMTP Mail Settings</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure query and reservation email delivery.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {smtpConfig?.source && (
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-secondary">
              <CheckCircle2 size={13} />
              {smtpConfig.source === "database"
                ? smtpConfig.isActive
                  ? "Dashboard Config"
                  : "Mail Disabled"
                : "Not Configured"}
            </span>
          )}
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
        <div className="space-y-4 lg:col-span-7">
          <section className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-neutral">
              <Server size={18} className="text-primary" />
              SMTP Server
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label>
                  <Server size={15} />
                  SMTP Host
                </label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className={errors.smtpHost ? "input-error" : ""}
                  {...register("smtpHost", {
                    required: "SMTP host is required",
                  })}
                />
                {errors.smtpHost && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.smtpHost.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label>SMTP Port</label>
                <input
                  type="number"
                  min={1}
                  max={65535}
                  placeholder="587"
                  className={errors.smtpPort ? "input-error" : ""}
                  {...register("smtpPort", {
                    valueAsNumber: true,
                    required: "SMTP port is required",
                    min: { value: 1, message: "Port must be valid" },
                    max: { value: 65535, message: "Port must be valid" },
                  })}
                />
                {errors.smtpPort && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.smtpPort.message}
                  </p>
                )}
                <p className="ml-1 text-[11px] font-medium text-muted-foreground">
                  Use 465 for SSL. Use 587 for STARTTLS, which is common for Gmail and most SMTP providers.
                </p>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label>
                  <UserRound size={15} />
                  SMTP User
                </label>
                <input
                  type="text"
                  placeholder="your-email@example.com"
                  className={errors.smtpUser ? "input-error" : ""}
                  {...register("smtpUser", {
                    required: "SMTP user is required",
                  })}
                />
                {errors.smtpUser && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.smtpUser.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label>
                  <KeyRound size={15} />
                  SMTP Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    smtpConfig?.hasSmtpPass
                      ? "Saved password. Leave blank to keep it."
                      : "SMTP password or app password"
                  }
                  {...register("smtpPass", {
                    validate: (value) =>
                      smtpConfig?.hasSmtpPass || Boolean(value?.trim()) || "SMTP password is required",
                  })}
                  className={errors.smtpPass ? "input-error" : ""}
                />
                {errors.smtpPass && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.smtpPass.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <section className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-neutral">
              <Send size={18} className="text-primary" />
              Sender & Admin
            </h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label>
                  <AtSign size={15} />
                  From Email
                </label>
                <input
                  type="email"
                  placeholder="noreply@example.com"
                  className={errors.smtpFromEmail ? "input-error" : ""}
                  {...register("smtpFromEmail", {
                    required: "From email is required",
                  })}
                />
                {errors.smtpFromEmail && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.smtpFromEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label>From Name</label>
                <input
                  type="text"
                  placeholder="Foodie Cafe & Restaurant"
                  {...register("smtpFromName")}
                />
              </div>

              <div className="space-y-1.5">
                <label>Admin Recipient Email</label>
                <input
                  type="text"
                  placeholder="admin@example.com"
                  className={errors.mailAdminTo ? "input-error" : ""}
                  {...register("mailAdminTo", {
                    required: "Admin recipient email is required",
                  })}
                />
                {errors.mailAdminTo && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.mailAdminTo.message}
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <span>
                  <span className="block text-sm font-bold text-neutral">
                    Enable Mailing
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Query and reservation notifications
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  {...register("isActive")}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-secondary/20 bg-secondary/10 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral">
              <ShieldCheck size={17} className="text-secondary" />
              Delivery Flow
            </h3>
            <div className="space-y-3 text-xs font-medium leading-6 text-muted-foreground">
              <p>Audience query sends an email to the admin recipient.</p>
              <p>Reservation sends an admin email and a confirmation email to the guest when guest email is available.</p>
              <p>Email sending works only after SMTP settings are saved here and Enable Mailing is turned on.</p>
              <p>Password is stored on the backend and never shown in this form.</p>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
