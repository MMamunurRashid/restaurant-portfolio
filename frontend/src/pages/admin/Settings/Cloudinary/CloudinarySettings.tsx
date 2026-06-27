import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  Cloud,
  Folder,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import type { ICloudinaryConfig } from "@/interface/cloudinaryConfigInterface";
import type { TResponse } from "@/interface/globalInterface";
import {
  useGetCloudinaryConfigQuery,
  useUpdateCloudinaryConfigMutation,
} from "@/redux/features/cloudinaryConfig/cloudinaryConfigApi";

type CloudinaryForm = ICloudinaryConfig;

const getErrorMessage = (res: TResponse) =>
  Array.isArray(res?.error?.data?.error) && res.error.data.error.length > 0
    ? `${res.error.data.error[0]?.path || ""} ${
        res.error.data.error[0]?.message || ""
      }`.trim()
    : res?.error?.data?.message || "Something went wrong!";

export default function CloudinarySettings() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CloudinaryForm>({
    defaultValues: {
      folder: "foodie-cafe",
      isActive: true,
    },
  });

  const { data, isLoading, isFetching } = useGetCloudinaryConfigQuery({});
  const cloudinaryConfig = data?.data;
  const [updateCloudinaryConfig, { isLoading: isUpdating }] =
    useUpdateCloudinaryConfigMutation();

  useEffect(() => {
    if (!cloudinaryConfig) return;

    reset({
      cloudName: cloudinaryConfig.cloudName || "",
      apiKey: cloudinaryConfig.apiKey || "",
      apiSecret: "",
      folder: cloudinaryConfig.folder || "foodie-cafe",
      isActive: cloudinaryConfig.isActive !== false,
    });
  }, [cloudinaryConfig, reset]);

  const onSubmit = async (form: CloudinaryForm) => {
    const payload: ICloudinaryConfig = {
      cloudName: form.cloudName?.trim(),
      apiKey: form.apiKey?.trim(),
      folder: form.folder?.trim() || "foodie-cafe",
      isActive: Boolean(form.isActive),
    };

    if (form.apiSecret?.trim()) {
      payload.apiSecret = form.apiSecret.trim();
    }

    const res = (await updateCloudinaryConfig(payload)) as TResponse;

    if (res?.data?.success) {
      toast.success("Cloudinary settings saved successfully");
      reset({
        ...res.data.data,
        apiSecret: "",
      });
      return;
    }

    toast.error(getErrorMessage(res));
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center font-bold text-muted-foreground animate-pulse">
        Loading Cloudinary settings...
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
            <UploadCloud size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral">
              Cloudinary Storage Settings
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure remote image and file uploads for Vercel deployment.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {cloudinaryConfig?.source && (
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-secondary">
              <CheckCircle2 size={13} />
              {cloudinaryConfig.source === "database"
                ? cloudinaryConfig.isActive
                  ? "Dashboard Config"
                  : "Storage Disabled"
                : "Not Configured"}
            </span>
          )}
          <button
            type="submit"
            disabled={isUpdating || isFetching}
            className="admin_primary_btn min-w-40 justify-center"
          >
            {isUpdating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isUpdating ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <section className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-neutral">
              <Cloud size={18} className="text-primary" />
              Cloudinary Account
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label>
                  <Cloud size={15} />
                  Cloud Name
                </label>
                <input
                  type="text"
                  placeholder="your-cloud-name"
                  className={errors.cloudName ? "input-error" : ""}
                  {...register("cloudName", {
                    required: "Cloud name is required",
                  })}
                />
                {errors.cloudName && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.cloudName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label>
                  <KeyRound size={15} />
                  API Key
                </label>
                <input
                  type="text"
                  placeholder="123456789012345"
                  className={errors.apiKey ? "input-error" : ""}
                  {...register("apiKey", {
                    required: "API key is required",
                  })}
                />
                {errors.apiKey && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.apiKey.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label>
                  <ShieldCheck size={15} />
                  API Secret
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    cloudinaryConfig?.hasApiSecret
                      ? "Saved secret. Leave blank to keep it."
                      : "Cloudinary API secret"
                  }
                  className={errors.apiSecret ? "input-error" : ""}
                  {...register("apiSecret", {
                    validate: (value) =>
                      cloudinaryConfig?.hasApiSecret ||
                      Boolean(value?.trim()) ||
                      "API secret is required",
                  })}
                />
                {errors.apiSecret && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.apiSecret.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <section className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-sm font-bold text-neutral">
              <Folder size={18} className="text-primary" />
              Upload Folder
            </h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label>
                  <Folder size={15} />
                  Root Folder
                </label>
                <input
                  type="text"
                  placeholder="foodie-cafe"
                  className={errors.folder ? "input-error" : ""}
                  {...register("folder", {
                    required: "Root folder is required",
                  })}
                />
                {errors.folder && (
                  <p className="ml-1 text-[10px] font-bold text-destructive">
                    {errors.folder.message}
                  </p>
                )}
                <p className="ml-1 text-[11px] font-medium text-muted-foreground">
                  Files will be grouped under this folder, then by module name.
                </p>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 p-4">
                <span>
                  <span className="block text-sm font-bold text-neutral">
                    Enable Cloudinary Uploads
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    New website uploads require this to be enabled.
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
              <UploadCloud size={17} className="text-secondary" />
              Storage Flow
            </h3>
            <div className="space-y-3 text-xs font-medium leading-6 text-muted-foreground">
              <p>Admin uploads are processed in memory and sent to Cloudinary.</p>
              <p>Images are converted to WebP before upload.</p>
              <p>PDF and other files are uploaded as raw Cloudinary assets.</p>
              <p>API secret is stored on the backend and never shown here.</p>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
