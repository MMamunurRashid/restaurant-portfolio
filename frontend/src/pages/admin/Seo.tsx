import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Save, Search, Globe, Shield, Plus, X, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAddSEOMutation, useGetSEOQuery, useUpdateSEOMutation } from '@/redux/features/seo/seoApi';
import type { TResponse } from '@/interface/globalInterface';

export default function SeoSettings() {
    const { register, handleSubmit, control, reset } = useForm<any>({
        defaultValues: {
            keywords: ['']
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "keywords"
    });


    const { data, isLoading: isFetching } = useGetSEOQuery({});
    const seo = data?.data;
    const id = seo?._id;

    useEffect(() => {
        if (seo) {
            reset({
                ...seo,
                keywords: seo.keywords?.length > 0 ? seo.keywords : ['']
            });
        }
    }, [seo, reset]);


    const [addSEO, { isLoading: isAdding }] = useAddSEOMutation();
    const [updateSEO, { isLoading: isUpdating }] = useUpdateSEOMutation();

    const onSubmit = async (data: any) => {
        const filteredKeywords = data.keywords.filter((k: string) => k.trim() !== "");

        const info = {
            ...data,
            keywords: filteredKeywords
        };

        try {
            if (id) {
                const res = (await updateSEO({ id, data: info })) as TResponse;
                if (res?.data?.success) {
                    toast.success("SEO Update Success");
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
                const res = (await addSEO(data)) as TResponse;
                if (res?.data?.success) {
                    toast.success("SEO Add Success");
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
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update SEO!");
            console.log(error);
        }
    };

    if (isFetching) return <div className="p-10 text-center animate-pulse font-bold text-slate-400">Loading SEO Configuration...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in duration-500">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Search size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">SEO & Meta Settings</h1>
                        <p className="text-slate-500 text-xs mt-1">Configure how your site appears on Google and Social Media.</p>
                    </div>
                </div>
                <button type="submit" disabled={isUpdating || isAdding} className="admin_primary_btn min-w-40">
                    <Save size={18} /> {isUpdating || isAdding ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Standard SEO */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b border-slate-50 pb-4">
                            <Globe size={18} className="text-primary" /> Basic Meta Information
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Type size={14} /> Site Title</label>
                                <input type="text" {...register("title", { required: true })} placeholder="Main Title for Search Engines" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">Description</label>
                                <textarea {...register("description")} rows={3} placeholder="Briefly describe your website content..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-primary/5 outline-none resize-none"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Author Name</label>
                                    <input type="text" {...register("author")} placeholder="e.g. Company Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                                    <input type="text" {...register("subject")} placeholder="e.g. Business Services" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Copyright</label>
                                    <input type="text" {...register("copyright")} placeholder="e.g. © 2024 Company Name" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                                    <span>Keywords</span>
                                    <button type="button" onClick={() => append('')} className="text-primary hover:underline flex items-center gap-1">
                                        <Plus size={12} /> Add Tag
                                    </button>
                                </label>
                                <div className="flex flex-wrap gap-2 p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                            <input type="text" {...register(`keywords.${index}`)} className="bg-transparent border-none p-0 focus:ring-0 text-sm w-32 shadow-none" placeholder="tag..." />
                                            <button type="button" onClick={() => remove(index)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Open Graph */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-6">
                        <h3 className="font-bold flex items-center gap-2 text-sm border-b border-slate-800 pb-4 text-slate-200">
                            <Shield size={18} className="text-primary" /> Webmaster Verification
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Google Site Verification</label>
                                <input type="text" {...register("google_site_verification")} className="font-mono text-[13px]" placeholder="g-verification-code" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Facebook Domain Verification</label>
                                <input type="text" {...register("facebook_domain_verification")} className="font-mono text-[13px]" placeholder="fb-verification-code" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}