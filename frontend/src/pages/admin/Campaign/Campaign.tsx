import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Save, Loader2, Info, Type, Image as ImageIcon } from 'lucide-react';
import FileUploadField from '@/utils/fileUploadField';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import { useAddCampaignMutation, useGetCampaignQuery, useUpdateCampaignMutation } from '@/redux/features/campaign/campaignApi';

export default function Campaign() {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<any>();

    const { data, isLoading: isFetching } = useGetCampaignQuery({});
    const campaign = data?.data;
    const id = campaign?._id;

    // Load existing data
    useEffect(() => {
        if (campaign) {
            reset({
                title: campaign?.title,
                subTitle: campaign?.subTitle,
                description: campaign?.description,
                image: campaign?.image,
            });
        }
    }, [campaign, reset]);

    const [addCampaign, { isLoading: isAdding }] = useAddCampaignMutation();
    const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();

    const onSubmit: SubmitHandler<any> = async (data) => {
        if (!data.image?.[0] && !campaign?.image) return toast.error("Image is required");

        const formData = new FormData();
        const info = {
            title: data.title,
            subTitle: data.subTitle,
            description: data.description,
        };

        formData.append('data', JSON.stringify(info));

        if (data.image?.[0] instanceof File) formData.append('image', data.image[0]);


        let res: TResponse;
        if (id) {
            res = (await updateCampaign({ id, data: formData })) as TResponse;
        } else {
            res = (await addCampaign(formData)) as TResponse;
        }

        if (res?.data?.success) {
            toast.success(id ? "Campaign updated successfully" : "Campaign added successfully");
        } else {
            const errorMsg = Array.isArray(res?.error?.data?.error)
                ? res?.error?.data?.error[0]?.message
                : res?.error?.data?.message || "Something went wrong!";
            toast.error(errorMsg);
        }

    };

    if (isFetching) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="font-medium animate-pulse">Loading Campaign Banner Settings...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Info size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">Campaign Banner</h1>
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
                                label="Campaign Image"
                                name="image"
                                watch={watch}
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                maxSize={2}
                            />
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
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Sub Title</label>
                                    <input type="text" {...register("subTitle")} placeholder="e.g. Limited Time Offer" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Main Title</label>
                                    <input type="text" {...register("title", { required: "Title is required" })} placeholder="Enter campaign title" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <textarea {...register("description", { required: "Description is required" })} placeholder="Enter campaign description" />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </form>
    );
}