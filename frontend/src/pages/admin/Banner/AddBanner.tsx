import { useForm, type SubmitHandler } from 'react-hook-form';
import { Save, ArrowLeft, Loader2, LayoutGrid, Type, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FileUploadField from '@/utils/fileUploadField';
import { useAddBannerMutation } from '@/redux/features/banner/bannerApi';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';

export default function AddBanner() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<any>({});

    const [addBanner, { isLoading }] = useAddBannerMutation();

    const onSubmit: SubmitHandler<any> = async (data) => {
        const formData = new FormData();

        // check file size
        if (data.image?.[0] && data.image[0].size > 2 * 1024 * 1024) {
            return toast.error("Image size should be less than 2MB");
        }

        const bannerData = {
            title: data.title,
            description: data.description,
            order: Number(data.order),
        };

        formData.append('data', JSON.stringify(bannerData));

        if (data.image?.[0]) {
            formData.append('image', data.image[0]);
        } else {
            return toast.error("Please upload a banner image");
        }

        try {
            const res: any = await addBanner(formData) as TResponse;
            if (res?.data?.success) {
                toast.success("Banner added successfully!");
                navigate('/admin/setting/banner/all');
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
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add banner");
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/setting/banner/all"
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Banner</h1>
                        <p className="text-slate-500 text-sm">Create a new hero section banner for your website.</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isLoading ? 'Saving...' : 'Publish Banner'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left Side: Image Upload */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4 text-sm mb-6">
                            <LayoutGrid size={18} className="text-primary" /> Banner Image
                        </h3>
                        <FileUploadField
                            label="Banner"
                            name="image"
                            required={true}
                            watch={watch}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            maxSize={2}
                        />
                        <p className="mt-4 text-[11px] text-slate-400 italic leading-relaxed text-center">
                            Recommended size: 1920x1080px. <br /> Aspect ratio 16:9 works best.
                        </p>
                    </div>
                </div>

                {/* Right Side: Banner Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4 text-sm">
                            <Type size={18} className="text-primary" /> Banner Information
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label>
                                    Banner Title
                                </label>
                                <input
                                    type="text"
                                    {...register("title", { required: "Title is required" })}
                                    placeholder="Enter eye-catching title"
                                    className={`${errors.title ? 'border-red-500 bg-red-50/30' : 'bg-slate-50/50'}`}
                                />
                                {errors.title && <p className="text-xs text-red-500 font-medium ml-1">{(errors.title as any).message}</p>}
                            </div>

                            {/* Order */}
                            <div className="space-y-2">
                                <label>
                                    Display Order
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Hash size={16} />
                                    </div>
                                    <input
                                        type="number"
                                        {...register("order", { required: "Order is required" })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="e.g. 1"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label> Description</label>
                                <textarea
                                    {...register("description", { required: "Description is required" })}
                                    placeholder="Write a short description about this banner..."
                                    className={`${errors.description ? 'border-red-500 bg-red-50/30' : 'bg-slate-50/50'}`}
                                ></textarea>
                                {errors.description && <p className="text-xs text-red-500 font-medium ml-1">{(errors.description as any).message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}