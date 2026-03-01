import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Save, ArrowLeft, Loader2, Type, Hash, AlignLeft, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FileUploadField from '@/utils/fileUploadField';
import { useGetBannerByIdQuery, useUpdateBannerMutation } from '@/redux/features/banner/bannerApi';
import toast from 'react-hot-toast';

export default function EditBanner() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Fetching current banner data
    const { data: bannerData, isLoading: isFetching } = useGetBannerByIdQuery(id);
    const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<any>();


    useEffect(() => {
        if (bannerData?.data) {
            reset({
                title: bannerData?.data?.title,
                description: bannerData?.data?.description,
                order: bannerData?.data?.order,
                image: bannerData?.data?.image,
            });
        }
    }, [bannerData, reset]);

    const onSubmit: SubmitHandler<any> = async (data) => {
        const formData = new FormData();
        const updatedInfo = {
            title: data.title,
            description: data.description,
            order: Number(data.order),
        };

        // check file size
        if (data.image?.[0] && data.image[0].size > 1 * 1024 * 1024) {
            return toast.error("Image size should be less than 1MB");
        }

        formData.append('data', JSON.stringify(updatedInfo));

        if (data.image?.[0] instanceof File) {
            formData.append('image', data.image[0]);
        }

        try {
            const res: any = await updateBanner({ id, data: formData }).unwrap();
            if (res?.success) {
                toast.success("Banner updated successfully!");
                navigate('/admin/setting/banner/all');
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update banner");
        }
    };

    if (isFetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="font-medium animate-pulse">Loading banner data...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/admin/setting/banner/all" className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Edit Banner</h1>
                        <p className="text-slate-500 text-sm italic">ID: {id}</p>
                    </div>
                </div>

                <button type="submit" disabled={isUpdating} className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 active:scale-95 transition-all">
                    {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Banner Image Preview/Upload */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4 text-sm mb-6">
                            <ImageIcon size={18} className="text-primary" /> Current Banner
                        </h3>
                        <FileUploadField
                            label="Replace Image"
                            name="image"
                            required={false}
                            watch={watch}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            maxSize={1}
                        />
                        <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] text-blue-600 leading-relaxed">
                                <strong>Tip:</strong> If you don't want to change the image, just leave this field as it is.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Content Fields */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Type size={16} className="text-primary" /> Banner Title
                                </label>
                                <input
                                    type="text"
                                    {...register("title", { required: "Title is required" })}
                                    className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.title ? 'border-red-500 bg-red-50' : 'bg-slate-50/50'}`}
                                />
                                {errors.title && <p className="text-xs text-red-500 font-medium ml-1">{(errors.title as any).message}</p>}
                            </div>

                            {/* Order */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Hash size={16} className="text-primary" /> Display Order
                                </label>
                                <input
                                    type="number"
                                    {...register("order", { required: "Order is required" })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <AlignLeft size={16} className="text-primary" /> Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}