import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Mail, Package, Sparkles } from 'lucide-react';
import { useGetContactQuery } from '@/redux/features/contact/contactApi';
import { useGetAllPackageQuery } from '@/redux/features/packages/packagesApi';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAddAppointmentMutation } from '@/redux/features/appointment/appointmentApi';
import type { TResponse } from '@/interface/globalInterface';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FieldInput } from '@/components/ui/inputField';
import { FieldTextarea } from '@/components/ui/textAreaField';


const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
    }),
};

export default function Appointment() {
    window.scrollTo(0, 0);

    const { data: packageData } = useGetAllPackageQuery({});
    const { data: contactData } = useGetContactQuery({});
    const [createAppointment, { isLoading }] = useAddAppointmentMutation();

    const packages = packageData?.data || [];

    const location = useLocation();

    // If URL contains ?package=slug-or-id, preselect that package (by slug or _id)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pkgParam = params.get('package');
        if (!pkgParam) return;
        if (!packages || packages.length === 0) return;

        const match = packages.find((p: any) => p.slug === pkgParam || p._id === pkgParam);
        if (match) {
            setFormData((prev) => {
                const current = prev.packages || [];
                if (current.includes(match._id)) return prev;
                return { ...prev, packages: [...current, match._id] };
            });
        }
    }, [location.search, packages]);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        date: '',
        time: '',
        packages: [] as string[],
        notes: '',
    });

    const set = (key: string) => (val: string) =>
        setFormData((prev) => ({ ...prev, [key]: val }));

    const togglePackage = (id: string) => {
        setFormData((prev) => {
            const current = prev.packages || [];
            if (current.includes(id)) return { ...prev, packages: current.filter((p) => p !== id) };
            return { ...prev, packages: [...current, id] };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createAppointment(formData) as TResponse;
            if (res?.data?.success) {
                toast.success("Appointment submitted successfully!");
                setFormData({ name: '', phone: '', email: '', address: '', date: '', time: '', packages: [], notes: '' });
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit appointment");
        }
    };

    return (
        <section className="min-h-screen bg-linear-to-br from-rose-50 via-white to-orange-50/30 py-24 px-4">
            {/* Blobs */}
            <div className="pointer-events-none fixed top-0 right-0 h-125 w-125 rounded-full bg-[#CC826C]/8 blur-[120px]" />
            <div className="pointer-events-none fixed bottom-0 left-0 h-100 w-100 rounded-full bg-rose-200/15 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-6xl">

                {/* Header */}
                <motion.div
                    className="mb-14"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#CC826C]/25 bg-[#CC826C]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#CC826C]">
                        <ShieldCheck size={13} />
                        Secure Booking
                    </div>
                    <h1 className="font-serif text-5xl font-normal leading-tight tracking-tight text-stone-800 md:text-6xl">
                        Book Your <br />
                        <span className="italic text-[#CC826C]">Beauty Session</span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-500">
                        Fill in your details below and we'll confirm your appointment within 24 hours.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Contact info + note */}
                    <motion.div
                        className="lg:col-span-4 space-y-5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Studio info card */}
                        <Card className="rounded-3xl border-stone-100 bg-white shadow-sm p-7 relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#CC826C]/6" />
                            <h3 className="font-serif text-lg font-normal text-stone-800 mb-6 flex items-center gap-2">
                                <Sparkles size={17} className="text-[#CC826C]" />
                                Studio Info
                            </h3>
                            <div className="space-y-5">
                                <ContactLine icon={<Phone />} label="Direct Line" value={contactData?.data?.phone} />
                                <Separator className="bg-stone-50" />
                                <ContactLine icon={<Mail />} label="Support Email" value={contactData?.data?.email} />
                                <Separator className="bg-stone-50" />
                                <ContactLine icon={<MapPin />} label="Our Location" value={contactData?.data?.address} />
                            </div>
                        </Card>

                        {/* Note card */}
                        <Card className="rounded-3xl border-[#CC826C]/15 bg-[#CC826C]/5 shadow-none p-6">
                            <p className="text-xs leading-relaxed text-[#CC826C]/80 font-medium">
                                📌 Appointments are confirmed after a follow-up call. Please ensure your phone number is correct.
                            </p>
                        </Card>


                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        className="lg:col-span-8"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card className="rounded-3xl border-stone-100 bg-white shadow-md shadow-stone-100/80 p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Required fields grid */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 mb-5">
                                        Your Details
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Full Name"
                                                placeholder="e.g. Fatema Akter"
                                                icon={<User size={16} />}
                                                value={formData.name}
                                                onChange={set('name')}
                                                required
                                            />
                                        </motion.div>
                                        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Phone Number"
                                                placeholder="+880 1X XX XXX XXX"
                                                icon={<Phone size={16} />}
                                                value={formData.phone}
                                                onChange={set('phone')}
                                                required
                                            />
                                        </motion.div>
                                        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Date"
                                                type="date"
                                                icon={<Calendar size={16} />}
                                                value={formData.date}
                                                onChange={set('date')}
                                                required
                                            />
                                        </motion.div>
                                        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Preferred Time"
                                                type="time"
                                                icon={<Clock size={16} />}
                                                value={formData.time}
                                                onChange={set('time')}
                                                required
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                <Separator className="bg-stone-50" />

                                {/* Optional fields */}
                                <div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Email Address"
                                                placeholder="you@example.com"
                                                type="email"
                                                icon={<Mail size={16} />}
                                                value={formData.email}
                                                onChange={set('email')}
                                            />
                                        </motion.div>
                                        <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Your Address"
                                                placeholder="Dhaka, Bangladesh"
                                                icon={<MapPin size={16} />}
                                                value={formData.address}
                                                onChange={set('address')}
                                            />
                                        </motion.div>
                                    </div>
                                    <div className="mt-3">
                                        <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldTextarea
                                                label="Additional Notes"
                                                placeholder="Any specific requests or questions?"
                                                icon={<Package size={16} />}
                                                value={formData.notes}
                                                onChange={set('notes')}
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                <Separator className="bg-stone-50" />

                                {/* Package selection */}
                                <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="show">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
                                            Choose a Package
                                        </p>
                                        <Package size={12} className="text-stone-400" />
                                    </div>
                                    <p className="text-xs text-stone-600 mb-5">Select the package you'd like to book.</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {packages.map((pkg: any) => {
                                            const isSelected = (formData.packages || []).includes(pkg._id);
                                            return (
                                                <button
                                                    type="button"
                                                    key={pkg._id}
                                                    onClick={() => togglePackage(pkg._id)}
                                                    className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-250 group ${isSelected
                                                        ? 'border-[#CC826C] bg-[#CC826C]/5'
                                                        : 'border-stone-100 bg-stone-50/60 hover:border-stone-200 hover:bg-white'
                                                        }`}
                                                >
                                                    {/* Selected dot */}
                                                    <span className={`absolute top-3.5 right-3.5 w-2 h-2 rounded-full transition-all duration-200 ${isSelected ? 'bg-[#CC826C] scale-100' : 'bg-stone-200 scale-75'
                                                        }`} />

                                                        <p className={`text-sm font-semibold leading-snug mb-1 pr-4 ${isSelected ? 'text-[#CC826C]' : 'text-stone-700'
                                                        }`}>
                                                        {pkg.title}
                                                    </p>

                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-xs font-bold ${isSelected ? 'text-[#CC826C]' : 'text-stone-500'}`}>
                                                            ৳{pkg.price.toLocaleString('en-BD')}
                                                        </span>
                                                        {pkg.isPopular && (
                                                            <Badge className="text-[9px] px-1.5 py-0 bg-rose-50 text-[#dc1f52] border border-rose-100 shadow-none font-bold uppercase tracking-wide hover:bg-rose-50">
                                                                Popular
                                                            </Badge>
                                                        )}
                                                        {pkg.isFeatured && (
                                                            <Badge className="text-[9px] px-1.5 py-0 bg-violet-50 text-violet-500 border border-violet-100 shadow-none font-bold uppercase tracking-wide hover:bg-violet-50">
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Submit */}
                                <motion.div
                                    className="pt-4"
                                    custom={7}
                                    variants={fieldVariants}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-[#CC826C] hover:bg-[#b8705a] text-white px-10 py-6 rounded-2xl font-semibold tracking-wide text-sm flex items-center gap-3 transition-all duration-300 group shadow-sm shadow-[#CC826C]/20 disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="animate-pulse">Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                Confirm Appointment
                                                <ArrowRight
                                                    size={16}
                                                    className="transition-transform group-hover:translate-x-1"
                                                />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// --- Sub-components ---



function ContactLine({ icon, label, value }: { icon: React.ReactElement; label: string; value?: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#CC826C]/8 flex items-center justify-center text-[#CC826C] shrink-0">
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 leading-none mb-1">{label}</p>
                <p className="text-sm font-semibold text-stone-700">{value || 'N/A'}</p>
            </div>
        </div>
    );
}