import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useGetContactQuery } from '@/redux/features/contact/contactApi';
import { useGetAllServiceQuery } from '@/redux/features/service/serviceApi';
import { motion } from 'framer-motion';
import { useAddAppointmentMutation } from '@/redux/features/appointment/appointmentApi';
import type { TResponse } from '@/interface/globalInterface';
import toast from 'react-hot-toast';

export default function Appointment() {
    window.scrollTo(0, 0);
    const { data: serviceData } = useGetAllServiceQuery({ isActive: true });
    const { data: contactData } = useGetContactQuery({});

    const [createAppointment, { isLoading }] = useAddAppointmentMutation();

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', location: '', occupation: '', service: '', date: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createAppointment(formData) as TResponse;
            if (res?.data?.success) {
                toast.success("Appointment submitted successfully!");
                setFormData({ name: '', email: '', phone: '', location: '', occupation: '', service: '', date: '' });
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
            toast.error(error?.data?.message || "Failed to submit appointment");
        }
    };

    return (
        <section className="min-h-screen bg-[#f8fafc] py-32">
            <div className="container">

                {/* 1. Header with Floating Badge */}
                <div className="mb-10">
                    <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-2 mb-6"
                    >
                        <ShieldCheck size={14} /> Secure Booking System
                    </motion.span>
                    <h1 className="text-5xl md:text-7xl font-black text-neutral tracking-tighter leading-none">
                        READY FOR <br />
                        <span className="text-primary">YOUR GLOW?</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* 2. Left Side: Floating Stats & Contact (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-all group-hover:scale-110" />
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Sparkles className="text-primary" size={20} /> Studio Hub
                            </h3>

                            <div className="space-y-6">
                                <ContactLine icon={<Phone />} label="Direct Line" value={contactData?.data?.phone} />
                                <ContactLine icon={<Mail />} label="Support Email" value={contactData?.data?.email} />
                                <ContactLine icon={<MapPin />} label="Our Location" value={contactData?.data?.address} />
                            </div>
                        </div>
                    </div>

                    {/* 3. Right Side: The "Floating" Form (Span 8) */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white p-8 md:p-16 rounded-[50px] shadow-2xl shadow-slate-200/50 border border-slate-50"
                        >
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                {/* Input Fields using a Minimalist Border-Bottom Style */}
                                <MinimalInput
                                    label="Full Name" placeholder="Your full name" icon={<User size={18} />}
                                    value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })}
                                />
                                <MinimalInput
                                    label="Email" placeholder="Email address" icon={<Mail size={18} />}
                                    value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })}
                                />
                                <MinimalInput
                                    label="Phone number" placeholder="+880..." icon={<Phone size={18} />}
                                    value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })}
                                />
                                <MinimalInput
                                    label="When to come?" type="date" icon={<Calendar size={18} />}
                                    value={formData.date} onChange={(v: string) => setFormData({ ...formData, date: v })}
                                />

                                <div className="md:col-span-2 mt-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Choose your transformation</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {serviceData?.data?.slice(0, 6).map((s: any) => (
                                            <div
                                                key={s._id}
                                                onClick={() => setFormData({ ...formData, service: s._id })}
                                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 ${formData.service === s._id
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                    }`}
                                            >
                                                <p className="text-[11px] font-bold text-center uppercase tracking-tighter leading-tight">{s.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Section */}
                                <div className="md:col-span-2 pt-10">
                                    <button
                                        disabled={isLoading}
                                        className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-secondary transition-all group duration-300"
                                    >
                                        {isLoading ? "Synchronizing..." : "Request Appointment"}
                                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// --- Internal UI Components ---

function MinimalInput({ label, placeholder, icon, type = "text", value, onChange }: any) {
    return (
        <div className="relative group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block group-focus-within:text-primary transition-colors">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <span className="text-slate-300 group-focus-within:text-primary transition-colors">{icon}</span>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}

                />
            </div>
        </div>
    );
}

function ContactLine({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-700">{value || 'N/A'}</p>
            </div>
        </div>
    );
}