import { useEffect, useRef } from 'react';
import { Controller, useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { Save, Loader2, Info, Type, Image as ImageIcon, Plus, Trash2, Hash } from 'lucide-react';
import FileUploadField from '@/utils/fileUploadField';
import { useAddAboutMutation, useGetAboutQuery, useUpdateAboutMutation } from '@/redux/features/about/aboutApi';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import JoditEditor from 'jodit-react';
import { JODIT_CONFIG } from '@/config/joditConfig';

export default function About() {
    const editor = useRef(null);
    const { register, handleSubmit, watch, setValue, control, reset, trigger, formState: { errors } } = useForm<any>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "stats",
    });

    const { data, isLoading: isFetching } = useGetAboutQuery({});
    const about = data?.data;
    const id = about?._id;

    // Load existing data
    useEffect(() => {
        if (about) {
            reset({
                title: about?.title,
                subTitle: about?.subTitle,
                description: about?.description,
                image: about?.image,
                stats: about?.stats || [{ title: "", count: "" }],
            });
        }
    }, [about, reset]);

    const handleAppend = async () => {
        const lastIndex = fields.length - 1;

        if (lastIndex >= 0) {
            const isValid = await trigger([
                `stats.${lastIndex}.title`,
                `stats.${lastIndex}.count`
            ]);

            if (!isValid) {
                toast.error("Please fill the previous stat fields first");
                return;
            }
        }
        append({ title: "", count: "" });
    };

    const [addAbout, { isLoading: isAdding }] = useAddAboutMutation();
    const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();

    const onSubmit: SubmitHandler<any> = async (data) => {
        if (!data.image?.[0] && !about?.image) return toast.error("Image is required");

        const formData = new FormData();
        const info = {
            title: data.title,
            subTitle: data.subTitle,
            description: data.description,
            stats: data.stats,
        };

        formData.append('data', JSON.stringify(info));

        if (data.image?.[0] instanceof File) formData.append('image', data.image[0]);

        try {
            let res: TResponse;
            if (id) {
                res = (await updateAbout({ id, data: formData })) as TResponse;
            } else {
                res = (await addAbout(formData)) as TResponse;
            }

            if (res?.data?.success) {
                toast.success(id ? "About updated successfully" : "About added successfully");
            } else {
                const errorMsg = Array.isArray(res?.error?.data?.error)
                    ? res?.error?.data?.error[0]?.message
                    : res?.error?.data?.message || "Something went wrong!";
                toast.error(errorMsg);
                console.log(res);
            }
        } catch (error: any) {
            toast.error("Failed to save changes");
            console.log(error);
        }
    };

    if (isFetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="font-medium animate-pulse">Loading About Settings...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Info size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">About Section</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage the main about us content and statistics.</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isUpdating || isAdding}
                    className="admin_primary_btn"
                >
                    {isUpdating || isAdding ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isUpdating || isAdding ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Left: Images */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm mb-6 border-b border-slate-50 pb-4">
                            <ImageIcon size={18} className="text-primary" /> Media Assets
                        </h3>
                        <div className="space-y-8">
                            <FileUploadField
                                label="About Image"
                                name="image"
                                watch={watch}
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                maxSize={2}
                            />
                        </div>
                    </div>

                    {/* Stats Array Field Section */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                <Hash size={18} className="text-primary" /> Achievement Stats
                            </h3>
                            <button
                                type="button"
                                onClick={handleAppend}
                                className="flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
                            >
                                <Plus size={14} /> Add New Stat
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col md:flex-row items-end gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100 relative group transition-all">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-slate-400">Count (e.g. 12+)</label>
                                            <input
                                                type="text"
                                                {...register(`stats.${index}.count` as const, { required: "Required" })}
                                                placeholder="12+"
                                                className={`bg-white ${((errors.stats && Array.isArray(errors.stats) && errors.stats[index]?.count) ? 'border-red-500 focus:ring-red-500' : '')}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-slate-400">Title (e.g. Years of Exp.)</label>
                                            <input
                                                type="text"
                                                {...register(`stats.${index}.title` as const, { required: "Required" })}
                                                placeholder="Years of Experience"
                                                className={`bg-white ${((errors.stats && Array.isArray(errors.stats) && errors.stats[index]?.title) ? 'border-red-500 focus:ring-red-500' : '')}`}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all mb-0.5"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Text Content & Stats */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Content Details */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm mb-2 border-b border-slate-50 pb-4">
                            <Type size={18} className="text-primary" /> Content Details
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Sub Title</label>
                                    <input type="text" {...register("subTitle")} placeholder="e.g. WHO WE ARE" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Main Title</label>
                                    <input type="text" {...register("title", { required: "Title is required" })} placeholder="Enter about title" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <div className="rounded-xl overflow-hidden border border-slate-200">
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <JoditEditor
                                                ref={editor}
                                                config={JODIT_CONFIG}
                                                value={field.value}
                                                onBlur={(newContent) => field.onChange(newContent)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </form>
    );
}