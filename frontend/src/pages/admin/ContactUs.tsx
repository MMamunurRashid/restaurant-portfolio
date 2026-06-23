import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { Plus, Trash2, Save, Info, Map, Loader2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import type { IContact } from '@/interface/contactInterface';
import { useAddContactMutation, useGetContactQuery, useUpdateContactMutation } from '@/redux/features/contact/contactApi';
import type { TResponse } from '@/interface/globalInterface';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const SOCIAL_OPTIONS = [
    { label: 'Facebook', value: 'facebook', icon: <FaFacebook size={16} className="text-blue-600" /> },
    { label: 'Instagram', value: 'instagram', icon: <FaInstagram size={16} className="text-pink-600" /> },
    { label: 'Twitter / X', value: 'twitter', icon: <FaTwitter size={16} className="text-slate-900" /> },
    { label: 'LinkedIn', value: 'linkedin', icon: <FaLinkedin size={16} className="text-blue-700" /> },
    { label: 'YouTube', value: 'youtube', icon: <FaYoutube size={16} className="text-red-600" /> },
    { label: 'TikTok', value: 'tiktok', icon: <SiTiktok size={16} /> },
    { label: 'WhatsApp', value: 'whatsapp', icon: <FaWhatsapp size={16} className="text-emerald-500" /> },
    { label: 'GitHub', value: 'github', icon: <FaGithub size={16} className="text-slate-800" /> },
];

export default function ContactUsManagement() {
    const { register, control, handleSubmit, reset } = useForm<IContact>();
    const { fields, append, remove } = useFieldArray({ control, name: "socials" });
    const { fields: officeFields, append: appendOffice, remove: removeOffice } = useFieldArray({ control, name: "officeHours" });
    const { data } = useGetContactQuery({});
    const [addContact, { isLoading }] = useAddContactMutation();
    const [updateContact, { isLoading: uLoading }] = useUpdateContactMutation();

    const contact = data?.data;
    const id = contact?._id;

    useEffect(() => {
        if (contact) {
            reset({
                ...contact,
                socials: contact.socials || [],
                officeHours: contact.officeHours || []
            });
        }
    }, [contact, reset]);

    const onSubmit: SubmitHandler<IContact> = async (formData) => {
        const res = (id ? await updateContact({ id, data: formData }) : await addContact(formData)) as TResponse;
        if (res?.data?.success) toast.success("Changes saved successfully");
        else toast.error(
            Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                : res?.error?.data?.message || "Something went wrong!"
        );
    };

    const inputClasses = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400";
    const labelClasses = "block text-sm font-semibold text-slate-700 mb-1.5";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 rounded-2xl p-4 shadow">
                <div>
                    <h1 className="text-2xl font-bold text-neutral">Contact Management</h1>
                    <p className="text-slate-500 text-sm">Configure how guests reach your restaurant.</p>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || uLoading}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                    {isLoading || uLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Settings
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left Side: Forms */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Basic Info Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <Info size={18} className="text-primary" />
                            <h2 className="font-bold text-slate-800">General Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-1">
                                <label className={labelClasses}>Main Title</label>
                                <input {...register("title", { required: true })} className={inputClasses} placeholder="e.g., Contact Us" />
                            </div>
                            <div className="md:col-span-1">
                                <label className={labelClasses}>Subtitle</label>
                                <input {...register("subTitle")} className={inputClasses} placeholder="e.g., Reach out anytime" />
                            </div>
                            <div className="md:col-span-1">
                                <label className={labelClasses}>Email Address</label>
                                <textarea {...register("email")} rows={2} className={inputClasses} placeholder="email1@test.com | email2@test.com" />
                            </div>
                            <div className="md:col-span-1">
                                <label className={labelClasses}>Phone Number</label>
                                <textarea {...register("phone")} rows={2} className={inputClasses} placeholder="+8801... | +8801..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClasses}>Restaurant Address</label>
                                <textarea {...register("address")} rows={2} className={inputClasses} placeholder="Full address here..." />
                            </div>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <Map size={18} className="text-primary" />
                            <h2 className="font-bold text-slate-800">Quick Links & Maps</h2>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClasses}>WhatsApp Link</label>
                                    <input {...register("whatsappLink")} className={inputClasses} placeholder="https://wa.me/..." />
                                </div>
                                <div>
                                    <label className={labelClasses}>Messenger Link</label>
                                    <input {...register("messengerLink")} className={inputClasses} placeholder="https://m.me/..." />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Google Maps Embed URL</label>
                                <input {...register("googleMapLink")} className={inputClasses} placeholder="Paste your map iframe src here" />
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-800">Opening Hours</h3>
                                    <button
                                        type="button"
                                        onClick={() => appendOffice({ day: '', hours: '' })}
                                        className="p-1.5 bg-slate-100 hover:bg-primary hover:text-white rounded-md text-slate-600 transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {officeFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                                            <input
                                                {...register(`officeHours.${index}.day` as const)}
                                                placeholder="Day (e.g., Monday)"
                                                className={`${inputClasses} md:col-span-2`}
                                            />
                                            <input
                                                {...register(`officeHours.${index}.hours` as const)}
                                                placeholder="Hours (e.g., 9:00 - 17:00)"
                                                className={`${inputClasses} md:col-span-3`}
                                            />
                                            <div className="md:col-span-1 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeOffice(index)}
                                                    className="text-red-500 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-red-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {officeFields.length === 0 && (
                                        <div className="text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-lg p-3">
                                            No opening hours added yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Social Media */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-slate-800">Social Links</h2>
                            <button
                                type="button"
                                onClick={() => append({ icon: 'facebook', url: '' })}
                                className="p-1.5 bg-slate-100 hover:bg-primary hover:text-white rounded-md text-slate-600 transition-all"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/30 relative">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute -top-2 -right-2 text-red-500 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-red-50"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                    <div className="space-y-3">
                                        <Controller
                                            control={control}
                                            name={`socials.${index}.icon`}
                                            render={({ field: { onChange, value } }) => {
                                                const selected = SOCIAL_OPTIONS.find(opt => opt.value === value);
                                                return (
                                                    <div className="relative">
                                                        <select
                                                            value={value}
                                                            onChange={(e) => onChange(e.target.value)}
                                                            className="w-full bg-white border border-slate-300 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
                                                        >
                                                            {SOCIAL_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                            {selected?.icon}
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                        <input
                                            {...register(`socials.${index}.url` as const)}
                                            placeholder="Profile URL"
                                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            ))}

                            {fields.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-lg">
                                    No social links added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
