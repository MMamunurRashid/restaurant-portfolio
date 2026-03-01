import React, { useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { API_URL } from '@/config';

export default function FileUploadField({ label, name, register, watch, errors, setValue, required = false, maxSize }: any) {
    const fileValue = watch(name);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (fileValue) {
            if (fileValue instanceof FileList && fileValue.length > 0) {
                const objectUrl = URL.createObjectURL(fileValue[0]);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setPreview(objectUrl);
                return () => URL.revokeObjectURL(objectUrl);
            }
            else if (typeof fileValue === 'string') {
                const fullUrl = fileValue.startsWith('http') ? fileValue : `${API_URL}${fileValue}`;
                setPreview(fullUrl);
            }
        } else {
            setPreview(null);
        }
    }, [fileValue]);

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue(name, null);
        setPreview(null);
    };

    // const hasValue = !!preview;

    return (
        <div className="space-y-1.5 w-full">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>

            <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all min-h-35 flex items-center justify-center overflow-hidden
                ${errors[name] ? 'border-red-200 bg-red-50/30' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-primary/20 hover:shadow-sm'}`}>

                {/* Hidden Input - It should always be present and cover the area when no file is there */}

                <input
                    type="file"
                    accept="image/*"
                    {...register(name, {
                        required: required ? `${label} is required` : false,
                        validate: {
                            fileSize: (files: FileList | string | null) => {
                                if (typeof files === "string") return true;

                                if (!files || !files[0]) return true;

                                const limit = (maxSize || 1) * 1024 * 1024;
                                return (
                                    files[0].size <= limit ||
                                    `Max size is ${maxSize || 1}MB`
                                );
                            },
                        },
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />


                <div className="flex flex-col items-center justify-center gap-2 text-center w-full pointer-events-none">
                    {preview ? (
                        <div className="flex flex-col items-center gap-2 relative pointer-events-auto">
                            {/* Delete Button */}
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -top-2 -right-2 z-30 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-90"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>

                            <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                                <img src={preview} alt="preview" className="w-full h-full object-cover p-1" />
                            </div>
                            {/* file size */}
                            {fileValue instanceof FileList && fileValue[0] && (
                                <p className="text-[9px] text-red-400 bg-red-100 px-2 py-1 rounded-full">
                                    Size: {(fileValue[0].size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-white rounded-full shadow-sm text-slate-400">
                                <Upload size={20} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-600 font-bold">Choose a file or drag & drop</p>
                                <p className="text-[9px] text-slate-400">PNG, JPG up to {maxSize || 1}MB</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {errors[name] && (
                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
}