
import type { TResponse } from '@/interface/globalInterface';
import type { IPackage } from '@/interface/packageInterface';
import type { ChangeEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { CircleCheckBig, ImagePlus, LayoutGrid, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAddPackageMutation, useGetPackageByIdQuery, useUpdatePackageMutation } from '@/redux/features/packages/packagesApi';
import { getMediaUrl } from '@/utils/media';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function PackageForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    const [services, setServices] = useState<string[]>([]);
    const [serviceInput, setServiceInput] = useState('');
    const [thumbnailPreview, setThumbnailPreview] = useState('');

    const { register, handleSubmit, setValue, control } = useForm({
        defaultValues: {
            title: '',
            description: '',
            price: 0,
            order: 0,
            thumbnail: undefined as File | undefined,
            isPopular: false,
            isFeatured: false,
        },
    });

    const { data: packageData } = useGetPackageByIdQuery(id, { skip: !id });
    const initialData: IPackage | undefined = packageData?.data;

    useEffect(() => {
        if (!initialData) return;
        setValue('title', initialData.title || '');
        setValue('description', initialData.description || '');
        setValue('price', initialData.price ?? 0);
        setValue('order', initialData.order ?? 0);
        setValue('isPopular', initialData.isPopular ?? false);
        setValue('isFeatured', initialData.isFeatured ?? false);
        setServices(initialData.services ?? []);
        setThumbnailPreview(initialData.thumbnail ? getMediaUrl(initialData.thumbnail) : '');
    }, [initialData, setValue]);

    const [addPackage, { isLoading }] = useAddPackageMutation();
    const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();

    const onFormSubmit = async (data: any) => {
        const formData = new FormData();
        const info = {
            title: data.title,
            description: data.description,
            price: Number(data.price || 0),
            order: Number(data.order || 0),
            isPopular: Boolean(data.isPopular),
            isFeatured: Boolean(data.isFeatured),
            services,
        };

        formData.append('data', JSON.stringify(info));
        if (data.thumbnail instanceof File) {
            formData.append('thumbnail', data.thumbnail);
        }

        let res: TResponse;
        if (id) {
            res = (await updatePackage({ id, data: formData })) as TResponse;
        } else {
            res = (await addPackage(formData)) as TResponse;
        }

        if (res?.data?.success) {
            toast.success(id ? 'Dining package updated!' : 'Dining package added!');
            navigate('/admin/packages/all');
        } else {
            toast.error(res?.error?.data?.message || 'Something went wrong!');
        }
    };

    const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        setValue('thumbnail', file as any);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <form onSubmit={handleSubmit(onFormSubmit)} className="">

                {/* Left Side: Main Content */}
                <div className=" space-y-4">
                    <div className="bg-white rounded-3xl p-2 md:p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <LayoutGrid size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Dining Package Information</h2>
                        </div>


                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Package Image</label>
                                <div
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="relative aspect-video w-full max-w-xl cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/40"
                                >
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="Package preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                                            <ImagePlus size={26} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Upload Package Image</span>
                                        </div>
                                    )}
                                    <input
                                        ref={thumbnailInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailChange}
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400">Optional. Max 2MB.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Package Title</label>
                                <input
                                    type="text"
                                    {...register('title', { required: true })}
                                    placeholder="e.g., Brunch for Two"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:bg-white focus:border-primary/30 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('price', { required: true })}
                                        placeholder="e.g., 1490"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:bg-white focus:border-primary/30 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sort Order</label>
                                    <input
                                        type="number"
                                        {...register('order')}
                                        placeholder="e.g., 1"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:bg-white focus:border-primary/30 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Flags</label>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Controller
                                                name="isPopular"
                                                control={control}
                                                render={({ field }) => (
                                                    <Switch checked={!!field.value} onCheckedChange={(val: any) => field.onChange(Boolean(val))} />
                                                )}
                                            />
                                            <span className="text-sm">Popular</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Controller
                                                name="isFeatured"
                                                control={control}
                                                render={({ field }) => (
                                                    <Switch checked={!!field.value} onCheckedChange={(val: any) => field.onChange(Boolean(val))} />
                                                )}
                                            />
                                            <span className="text-sm">Featured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    placeholder="Short package description for the website."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:bg-white focus:border-primary/30 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Items Included</label>
                                <div className="flex gap-2">
                                    <input
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        placeholder="Add an item, e.g., Two signature coffees"
                                        className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 focus:bg-white focus:border-primary/30 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const val = serviceInput.trim();
                                            if (!val) return;
                                            setServices((p) => [...p, val]);
                                            setServiceInput('');
                                        }}
                                        className="bg-primary text-white rounded-2xl px-4 py-3 flex items-center gap-2"
                                    >
                                        <ImagePlus size={16} /> Add
                                    </button>
                                </div>

                                <div className="mt-3 space-y-2">
                                    {services.length === 0 ? (
                                        <p className="text-sm text-slate-400">No included items added yet.</p>
                                    ) : (
                                        services.map((s, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 rounded-xl py-2 px-4">
                                                <p className='flex items-center gap-2'><CircleCheckBig className='text-blue-600 h-5 w-5' /><span className="text-[16px]">{s}</span></p>
                                                <button
                                                    type="button"
                                                    onClick={() => setServices((prev) => prev.filter((_, i) => i !== idx))}
                                                    className="text-red-500 hover:text-red-600"
                                                    title="Remove service"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-2 md:p-6 shadow-sm border border-slate-100 space-y-4">
                        <button
                            disabled={isLoading || isUpdating}
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading || isUpdating ? <Loader2 className="animate-spin" /> : (id ? 'Update Dining Package' : 'Publish Dining Package')}
                        </button>
                    </div>

                </div>

            </form>
        </div>
    );
}

const Loader2 = ({ className }: { className?: string }) => (
    <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
