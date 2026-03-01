import { useForm, type SubmitHandler } from 'react-hook-form';
import { Save, Layout, Loader2, } from 'lucide-react';
import FileUploadField from '@/utils/fileUploadField';
import { useAddGeneralSettingMutation, useGetGeneralSettingQuery, useUpdateGeneralSettingMutation } from '@/redux/features/generalSetting/generalSettingApi';
import type { TResponse } from '@/interface/globalInterface';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function GeneralSettings() {
    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<any>();

    const { data } = useGetGeneralSettingQuery({});
    const generalSettings = data?.data;
    const id = generalSettings?._id;

    useEffect(() => {
        if (generalSettings) {
            reset({
                siteName: generalSettings?.siteName,
                tagline: generalSettings?.tagline,
                siteTitle: generalSettings?.siteTitle,
                logo: generalSettings?.logo,
                favicon: generalSettings?.favicon || '',
            });
        }
    }, [generalSettings, reset]);


    const [addGeneralSetting, { isLoading: isAdding }] = useAddGeneralSettingMutation();
    const [updateGeneralSetting, { isLoading: isUpdating }] = useUpdateGeneralSettingMutation();

    const onSubmit: SubmitHandler<any> = async (data) => {
        const formData = new FormData();

        const newData = {
            siteName: data.siteName,
            tagline: data.tagline,
            siteTitle: data.siteTitle,
        }

        formData.append('data', JSON.stringify(newData));
        if (data.logo?.[0]) formData.append('logo', data.logo[0]);
        if (data.favicon?.[0]) formData.append('favicon', data.favicon[0]);


        if (id) {
            const res = (await updateGeneralSetting({ id, data: formData })) as TResponse;
            if (res?.data?.success) {
                toast.success("General Setting Update Success");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) &&
                        res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""
                            }`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
                console.log(res);
            }
        } else {
            const res = (await addGeneralSetting(formData)) as TResponse;
            if (res?.data?.success) {
                toast.success("General Setting Add Success");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) &&
                        res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""
                            }`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
                console.log(res);
            }
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">General Settings</h1>
                    <p className="text-slate-500 text-sm">Update site identity and branding assets.</p>
                </div>
                <button type="submit" className="admin_primary_btn" disabled={isAdding || isUpdating}>
                    <Save size={18} />
                    {isAdding || isUpdating ? <Loader2 /> : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left: Branding Assets */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4 text-sm">
                            Branding Assets
                        </h3>
                        <FileUploadField label="Site Logo" name="logo" required={id ? false : true} watch={watch} register={register} errors={errors} setValue={setValue} />
                        <FileUploadField label="Favicon (32x32)" name="favicon" watch={watch} register={register} errors={errors} setValue={setValue} />
                    </div>
                </div>

                {/* Right: Site Info & SEO */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-neutral flex items-center gap-2 border-b border-slate-50 pb-4 text-sm">
                            <Layout size={18} className="text-primary" /> Site Identity
                        </h3>
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-1.5">
                                <label>Site Name</label>
                                <input type="text" {...register("siteName", { required: "Site name is required" })} className={errors.siteName ? "input-error" : ""} />
                            </div>
                            <div className="space-y-1.5">
                                <label>Tagline</label>
                                <input type="text" {...register("tagline")} placeholder="Ex: Best Agency" />
                            </div>
                            <div className="space-y-1.5">
                                <label>Site Title</label>
                                <input type="text" {...register("siteTitle", { required: "Site Title is required" })} className={errors.siteTitle ? "input-error" : ""} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}