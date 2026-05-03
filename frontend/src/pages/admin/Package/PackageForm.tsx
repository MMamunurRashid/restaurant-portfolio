
import type { TResponse } from '@/interface/globalInterface';
import type { IPackage } from '@/interface/packageInterface';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { CircleCheckBig, ImagePlus, LayoutGrid, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAddPackageMutation, useGetPackageByIdQuery, useUpdatePackageMutation } from '@/redux/features/packages/packagesApi';

export default function PackageForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [services, setServices] = useState<string[]>([]);
    const [serviceInput, setServiceInput] = useState('');

    const { register, handleSubmit, setValue, control } = useForm({
        defaultValues: {
            title: '',
            price: 0,
            isPopular: false,
            isFeatured: false,
        },
    });

    const { data: packageData } = useGetPackageByIdQuery(id, { skip: !id });
    const initialData: IPackage | undefined = packageData?.data;

    useEffect(() => {
        if (!initialData) return;
        setValue('title', initialData.title || '');
        setValue('price', initialData.price ?? 0);
        setValue('isPopular', initialData.isPopular ?? false);
        setValue('isFeatured', initialData.isFeatured ?? false);
        setServices(initialData.services ?? []);
    }, [initialData, setValue]);

    const [addPackage, { isLoading }] = useAddPackageMutation();
    const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();

    const onFormSubmit = async (data: any) => {
        const info = {
            title: data.title,
            price: Number(data.price || 0),
            isPopular: Boolean(data.isPopular),
            isFeatured: Boolean(data.isFeatured),
            services,
        };

        let res: TResponse;
        if (id) {
            res = (await updatePackage({ id, data: info })) as TResponse;
        } else {
            res = (await addPackage(info)) as TResponse;
        }

        if (res?.data?.success) {
            toast.success(id ? 'Package updated!' : 'Package added!');
            navigate('/admin/packages/all');
        } else {
            toast.error(res?.error?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <form onSubmit={handleSubmit(onFormSubmit)} className="">

                {/* Left Side: Main Content */}
                <div className=" space-y-4">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <LayoutGrid size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Package Information</h2>
                        </div>


                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Package Title</label>
                                <input
                                    type="text"
                                    {...register('title', { required: true })}
                                    placeholder="e.g., Luxury Facial Treatment"
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
                                        placeholder="e.g., 49.99"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:bg-white focus:border-primary/30 outline-none transition-all"
                                    />
                                </div>

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
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Services Included</label>
                                <div className="flex gap-2">
                                    <input
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        placeholder="Add a service, e.g., Deep Cleansing"
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
                                        <p className="text-sm text-slate-400">No services added yet.</p>
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
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <button
                            disabled={isLoading || isUpdating}
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading || isUpdating ? <Loader2 className="animate-spin" /> : (id ? 'Update Package' : 'Publish Package')}
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