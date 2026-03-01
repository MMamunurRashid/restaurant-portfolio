import { CONFIG } from '@/config';
import type { TResponse } from '@/interface/globalInterface';
import React, { useState, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { JODIT_CONFIG } from '@/config/joditConfig';
import { ImagePlus, LayoutGrid, AlertCircle, Trash2 } from 'lucide-react';
import { useAddServiceMutation, useGetServiceByIdQuery, useUpdateServiceMutation } from '@/redux/features/service/serviceApi';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function ServiceForm() {
    const { id } = useParams();
    const editor = useRef(null);
    const navigate = useNavigate();
    const thumbInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const [thumbPreview, setThumbPreview] = useState<string>('');
    const [iconPreview, setIconPreview] = useState<string>('');
    const [galleryPreviews, setGalleryPreviews] = useState<{ url: string; isFile: boolean; fileRef?: File }[]>([]);
    const [fileError, setFileError] = useState<string>('');

    const { register, handleSubmit, setValue, reset, control } = useForm({
        defaultValues: {
            title: '',
            description: '',
            isActive: true
        }
    });

    const { data: serviceData } = useGetServiceByIdQuery(id, { skip: !id });
    const initialData = serviceData?.data;

    console.log(serviceData);


    useEffect(() => {
        if (initialData) {
            reset(initialData);

            // Thumbnail Preview
            if (initialData.thumbnail) {
                setThumbPreview(initialData.thumbnail.startsWith('http') ? initialData.thumbnail : `${CONFIG.BASE_URL}/${initialData.thumbnail}`);
            }

            // Icon Preview
            if (initialData.icon) {
                setIconPreview(initialData.icon.startsWith('http') ? initialData.icon : `${CONFIG.BASE_URL}/${initialData.icon}`);
            }

            // Gallery Previews
            if (initialData.galleries) {
                const initialGals = (initialData.galleries as string[]).map(url => ({
                    url: url.startsWith('http') ? url : `${CONFIG.BASE_URL}/${url}`,
                    isFile: false
                }));
                setGalleryPreviews(initialGals);
            }
        }
    }, [initialData, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'icon' | 'gallery') => {
        setFileError('');
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        if (type === 'gallery') {
            const validFiles = files.filter(f => f.size <= MAX_FILE_SIZE);
            if (validFiles.length < files.length) setFileError('Some images exceed 2MB');

            const newPreviews = validFiles.map(file => ({
                url: URL.createObjectURL(file),
                isFile: true,
                fileRef: file
            }));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        } else {
            const file = files[0];
            if (file.size > MAX_FILE_SIZE) {
                setFileError(`${type} size must be less than 2MB`);
                return;
            }
            setValue(type as any, file as any);
            const url = URL.createObjectURL(file);
            type === 'thumbnail' ? setThumbPreview(url) : setIconPreview(url);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const [addService, { isLoading }] = useAddServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

    const onFormSubmit = async (data: any) => {
        const formData = new FormData();

        // Append single files
        if (data.thumbnail instanceof File) formData.append('thumbnail', data.thumbnail);
        if (data.icon instanceof File) formData.append('icon', data.icon);

        // Handle Gallery
        const existingGalleries: string[] = [];
        galleryPreviews.forEach(item => {
            if (!item.isFile) {
                existingGalleries.push(item.url.replace(`${CONFIG.BASE_URL}/`, ''));
            } else if (item.fileRef) {
                formData.append('gallery', item.fileRef);
            }
        });

        const info = {
            title: data.title,
            description: data.description,
            isActive: data.isActive,
            existingGalleries,
        };

        formData.append("data", JSON.stringify(info));


        let res: TResponse;
        if (id) {
            res = await updateService({ id, data: formData }) as TResponse;
        } else {
            res = await addService(formData) as TResponse;
        }

        if (res?.data?.success) {
            toast.success(id ? "Service updated!" : "Service added!");
            navigate('/admin/services/all');
        } else {
            toast.error(res?.error?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <form onSubmit={handleSubmit(onFormSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Left Side: Main Content */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <LayoutGrid size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Service Information</h2>
                        </div>

                        {fileError && (
                            <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm font-semibold animate-shake">
                                <AlertCircle size={18} /> {fileError}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Title</label>
                                <input
                                    type="text"
                                    {...register("title", { required: true })}
                                    placeholder="e.g., Luxury Facial Treatment"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 focus:bg-white focus:border-primary/30 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <div className="rounded-2xl overflow-hidden border-2 border-slate-100">
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

                    {/* Gallery Section */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Service Gallery</h2>
                        <div
                            onClick={() => document.getElementById('gallery-input')?.click()}
                            className="group border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">
                                    <ImagePlus className="text-slate-400 group-hover:text-primary" size={24} />
                                </div>
                                <span className="text-slate-500 font-bold text-sm">Click to upload gallery images</span>
                                <p className="text-[10px] text-slate-400 uppercase tracking-tighter italic">Max 2MB per image</p>
                            </div>
                            <input id="gallery-input" type="file" multiple onChange={(e) => handleFileChange(e, 'gallery')} className="hidden" accept="image/*" />
                        </div>

                        {galleryPreviews.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-6">
                                {galleryPreviews.map((item, i) => (
                                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100">
                                        <img src={item.url} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="Gallery" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => removeGalleryImage(i)} className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Icon Upload */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest">Service Icon</h2>
                        <div
                            onClick={() => iconInputRef.current?.click()}
                            className="relative w-20 h-20 mx-auto bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/40 transition-all overflow-hidden"
                        >
                            {iconPreview ? (
                                <img src={iconPreview} className="w-full h-full object-contain p-2" alt="Icon" />
                            ) : (
                                <ImagePlus className="text-slate-300" size={24} />
                            )}
                            <input ref={iconInputRef} type="file" onChange={(e) => handleFileChange(e, 'icon')} className="hidden" accept="image/*" />
                        </div>
                        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium italic">Transparent PNG is best</p>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest">Featured Image</h2>
                        <div
                            onClick={() => thumbInputRef.current?.click()}
                            className="relative aspect-video w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/40 transition-all"
                        >
                            {thumbPreview ? (
                                <img src={thumbPreview} className="w-full h-full object-cover" alt="Thumb" />
                            ) : (
                                <div className="text-center p-4">
                                    <ImagePlus className="text-slate-300 mx-auto mb-1" size={24} />
                                    <span className="text-slate-400 text-[10px] font-bold uppercase">Cover Image</span>
                                </div>
                            )}
                            <input ref={thumbInputRef} type="file" onChange={(e) => handleFileChange(e, 'thumbnail')} className="hidden" accept="image/*" />
                        </div>
                    </div>

                    {/* Status & Action */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <button
                            disabled={isLoading || isUpdating}
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading || isUpdating ? <Loader2 className="animate-spin" /> : (id ? 'Update Service' : 'Publish Service')}
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