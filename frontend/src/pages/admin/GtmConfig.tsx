import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Save, Loader2, Settings, ExternalLink, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAddGtmConfigMutation, useGetGtmConfigQuery, useUpdateGtmConfigMutation } from '@/redux/features/gtm/gtmApi';
import type { TResponse } from '@/interface/globalInterface';

export default function GtmConfig() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ gtmId: string }>();

    const { data, isLoading: isFetching } = useGetGtmConfigQuery({});
    const gtm = data?.data;
    const id = gtm?._id;


    // 2. Load Existing Data
    useEffect(() => {
        if (gtm) {
            reset({
                gtmId: gtm?.gtmId
            });
        }
    }, [gtm, reset]);


    const [addGtmConfig, { isLoading: isAdding }] = useAddGtmConfigMutation();
    const [updateGtmConfig, { isLoading: isUpdating }] = useUpdateGtmConfigMutation();


    const onSubmit: SubmitHandler<{ gtmId: string }> = async (data) => {
        if (id) {
            const res = (await updateGtmConfig({ id, data: data })) as TResponse;
            if (res?.data?.success) {
                toast.success("GTM Configuration updated!");
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
            const res = (await addGtmConfig(data)) as TResponse;
            if (res?.data?.success) {
                toast.success("GTM Configuration Add Success");
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

    if (isFetching) {
        return (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-slate-400 text-sm animate-pulse font-medium">Fetching configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Google Tag Manager</h1>
                        <p className="text-slate-500 text-xs mt-1">Configure your GTM ID for tracking and analytics.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Side: Instructions */}
                <div className="md:col-span-1 space-y-3">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-primary" />
                            How it works?
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Google Tag Manager (GTM) allows you to manage and deploy marketing tags on your website without having to modify the code.
                        </p>
                        <a
                            href="https://tagmanager.google.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-primary mt-4 hover:underline font-medium"
                        >
                            Get GTM ID <ExternalLink size={10} />
                        </a>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                        <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
                            <strong>Note:</strong> Your ID should look like <span className="underline">GTM-XXXXXXX</span>. Enter only the ID here.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                GTM Container ID
                            </label>
                            <input
                                type="text"
                                {...register("gtmId", {
                                    required: "GTM ID is required",
                                    pattern: {
                                        value: /^GTM-[A-Z0-9]+$/,
                                        message: "Invalid format. Expected GTM-XXXXXX"
                                    }
                                })}
                                placeholder="e.g. GTM-W2L9XX"
                                className={`${errors.gtmId ? 'border-red-400 bg-red-50/30' : ''}`}
                            />
                            {errors.gtmId && (
                                <p className="text-[11px] text-red-500 font-bold ml-1 animate-in fade-in">
                                    {errors.gtmId.message}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isUpdating || isAdding}
                                className="admin_primary_btn"
                            >
                                {isUpdating || isAdding ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {isUpdating || isAdding ? 'Saving Changes...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}