import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Mail, Package, Sparkles, Clock10, Users } from 'lucide-react';
import { useGetContactQuery } from '@/redux/features/contact/contactApi';
import { useGetAllPackageQuery } from '@/redux/features/packages/packagesApi';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAddAppointmentMutation, useGetAvailableSlotsQuery } from '@/redux/features/appointment/appointmentApi';
import type { TResponse } from '@/interface/globalInterface';
import AppointmentReceipt from '@/components/shared/AppointmentReceipt';
import type { IAppointment } from '@/interface/appointmentInterface';
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

    const { data: packageData } = useGetAllPackageQuery({});
    const { data: contactData } = useGetContactQuery({});
    const [createAppointment, { isLoading }] = useAddAppointmentMutation();

    const packages = packageData?.data || [];

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        guestCount: 2,
        packages: [] as string[],
        notes: '',
    });

    const [receiptOpen, setReceiptOpen] = useState(false);
    const [receiptAppointment, setReceiptAppointment] = useState<IAppointment | null>(null);
    const { data: slotResponse, isFetching: isFetchingSlots } = useGetAvailableSlotsQuery(
        { date: formData.date, guestCount: formData.guestCount },
        { skip: !formData.date || !formData.guestCount }
    );
    const slotData = slotResponse?.data;
    const slots = slotData?.slots || [];

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
        if (!formData.time) {
            toast.error("Please select an available time slot");
            return;
        }

        try {
            const res = await createAppointment(formData) as TResponse;
            if (res?.data?.success) {
                toast.success("Reservation request submitted successfully!");
                const created = res?.data?.data as IAppointment;
                if (created && created._id) {
                    setReceiptAppointment(created);
                    setReceiptOpen(true);
                }
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to submit reservation");
        }
    };

    const handleReceiptClose = () => {
        setReceiptOpen(false);
        setReceiptAppointment(null);
        setFormData({ name: '', phone: '', email: '', address: '', date: '', time: '', guestCount: 2, packages: [], notes: '' });
    };

    return (
        <section className="min-h-screen bg-muted py-24 px-4 md:py-32">
            <div className="relative z-10 mx-auto max-w-6xl">

                {/* Header */}
                <motion.div
                    className="mb-14"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-secondary/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-secondary">
                        <ShieldCheck size={13} />
                        Table Reservation
                    </div>
                    <h1 className="font-serif text-5xl font-normal leading-tight tracking-tight text-stone-800 md:text-6xl">
                        Reserve Your <br />
                        <span className="italic text-secondary">Table</span>
                    </h1>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-500">
                        Share your preferred date, time, and guest details. Our team will confirm your table shortly.
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
                        {/* Restaurant info card */}
                        <Card className="rounded-3xl border-stone-100 bg-white shadow-sm p-7 relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-secondary/10" />
                            <h3 className="font-serif text-lg font-normal text-stone-800 mb-6 flex items-center gap-2">
                                <Sparkles size={17} className="text-secondary" />
                                Restaurant Info
                            </h3>
                            <div className="space-y-5">
                                <ContactLine icon={<Phone />} label="Direct Line" value={contactData?.data?.phone} />
                                <Separator className="bg-stone-50" />
                                <ContactLine icon={<Mail />} label="Support Email" value={contactData?.data?.email} />
                                <Separator className="bg-stone-50" />
                                <ContactLine icon={<MapPin />} label="Our Location" value={contactData?.data?.address} />
                            </div>
                        </Card>

                        {
                            contactData?.data?.officeHours?.length ? (
                                <>
                                    <Card className="rounded-3xl border-stone-100 bg-white shadow-sm p-7 relative overflow-hidden">
                                        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-secondary/10" />
                                        <h3 className="font-serif text-lg font-normal text-stone-800 mb-3 flex items-center gap-2">
                                            <Clock10 size={17} className="text-secondary" />
                                            Opening Hours
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            {contactData?.data?.officeHours?.map((item: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between gap-4">
                                                    <span className="text-sm font-bold text-stone-800">{item.day}</span>
                                                    <span
                                                        className={`text-sm font-medium tabular-nums transition-colors
                                                                ${item.hours === "Closed" || item.hours === "closed"
                                                                ? "text-destructive"
                                                                : "text-stone-600"
                                                            }`}
                                                    >
                                                        {item.hours}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </>
                            ) : null
                        }

                        {/* Note card */}
                        <Card className="rounded-3xl border-secondary/20 bg-secondary/10 shadow-none p-6">
                            <p className="text-xs leading-relaxed text-secondary/80 font-medium">
                                Reservations are confirmed after a follow-up call. Please ensure your phone number is correct.
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
                                                label="Guest Count"
                                                placeholder="2"
                                                type="number"
                                                icon={<Users size={16} />}
                                                value={String(formData.guestCount)}
                                                onChange={(value) => {
                                                    const parsed = Number(value);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        guestCount: Number.isFinite(parsed) && parsed > 0 ? parsed : 1,
                                                        time: '',
                                                    }));
                                                }}
                                                required
                                            />
                                        </motion.div>
                                        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Date"
                                                type="date"
                                                icon={<Calendar size={16} />}
                                                value={formData.date}
                                                onChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        date: value,
                                                        time: '',
                                                    }))
                                                }
                                                required
                                            />
                                        </motion.div>
                                        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show" className="md:col-span-2">
                                            <div>
                                                <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600">
                                                    <Clock size={14} />
                                                    Available Time Slots
                                                    <span className="text-primary">*</span>
                                                </div>
                                                {!formData.date ? (
                                                    <p className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-xs font-medium text-stone-500">
                                                        Select a date to see available reservation slots.
                                                    </p>
                                                ) : isFetchingSlots ? (
                                                    <p className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-xs font-medium text-stone-500">
                                                        Checking available slots...
                                                    </p>
                                                ) : slots.length > 0 ? (
                                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                                        {slots.map((slot: any) => {
                                                            const isSelected = formData.time === slot.time;
                                                            return (
                                                                <button
                                                                    key={slot.time}
                                                                    type="button"
                                                                    disabled={!slot.available}
                                                                    title={slot.disabledReason || `${slot.remainingGuests} guests remaining`}
                                                                    onClick={() => setFormData((prev) => ({ ...prev, time: slot.time }))}
                                                                    className={`rounded-2xl border px-3 py-3 text-center transition-all disabled:cursor-not-allowed disabled:opacity-50 ${isSelected
                                                                        ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
                                                                        : slot.available
                                                                            ? 'border-stone-100 bg-stone-50 text-stone-700 hover:border-primary hover:bg-primary/5 hover:text-primary'
                                                                            : 'border-stone-100 bg-stone-100 text-stone-400'
                                                                        }`}
                                                                >
                                                                    <span className="block text-sm font-bold">{slot.label}</span>
                                                                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide">
                                                                        {slot.available ? `${slot.remainingGuests} seats left` : 'Unavailable'}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
                                                        {slotData?.reason || 'No slots available for this date.'}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                <Separator className="bg-stone-50" />

                                {/* Optional fields */}
                                <div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Email Address"
                                                placeholder="you@example.com"
                                                type="email"
                                                icon={<Mail size={16} />}
                                                value={formData.email}
                                                onChange={set('email')}
                                            />
                                        </motion.div>
                                        <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldInput
                                                label="Area / Address"
                                                placeholder="Dhaka, Bangladesh"
                                                icon={<MapPin size={16} />}
                                                value={formData.address}
                                                onChange={set('address')}
                                            />
                                        </motion.div>
                                    </div>
                                    <div className="mt-3">
                                        <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="show">
                                            <FieldTextarea
                                                label="Additional Notes"
                                                placeholder="Guest count, seating preference, dietary needs, or event details."
                                                icon={<Package size={16} />}
                                                value={formData.notes}
                                                onChange={set('notes')}
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                <Separator className="bg-stone-50" />

                                {/* Package selection */}
                                <motion.div custom={8} variants={fieldVariants} initial="hidden" animate="show">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
                                            Choose a Dining Package
                                        </p>
                                        <Package size={12} className="text-stone-400" />
                                    </div>
                                    <p className="text-xs text-stone-600 mb-5">Select a dining package or submit a general reservation.</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {packages.map((pkg: any) => {
                                            const isSelected = (formData.packages || []).includes(pkg._id);
                                            return (
                                                <button
                                                    type="button"
                                                    key={pkg._id}
                                                    onClick={() => togglePackage(pkg._id)}
                                                    className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-250 group ${isSelected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-stone-100 bg-stone-50/60 hover:border-stone-200 hover:bg-white'
                                                        }`}
                                                >
                                                    {/* Selected dot */}
                                                    <span className={`absolute top-3.5 right-3.5 w-2 h-2 rounded-full transition-all duration-200 ${isSelected ? 'bg-primary scale-100' : 'bg-stone-200 scale-75'
                                                        }`} />

                                                    <p className={`text-sm font-semibold leading-snug mb-1 pr-4 ${isSelected ? 'text-primary' : 'text-stone-700'
                                                        }`}>
                                                        {pkg.title}
                                                    </p>

                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-stone-500'}`}>
                                                            ৳{pkg.price.toLocaleString('en-BD')}
                                                        </span>
                                                        {pkg.isPopular && (
                                                            <Badge className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border border-primary/20 shadow-none font-bold uppercase tracking-wide hover:bg-primary/10">
                                                                Popular
                                                            </Badge>
                                                        )}
                                                        {pkg.isFeatured && (
                                                            <Badge className="text-[9px] px-1.5 py-0 bg-secondary/10 text-secondary border border-secondary/20 shadow-none font-bold uppercase tracking-wide hover:bg-secondary/10">
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
                                    custom={9}
                                    variants={fieldVariants}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-primary hover:bg-primary/90 text-white px-10 py-6 rounded-2xl font-semibold tracking-wide text-sm flex items-center gap-3 transition-all duration-300 group shadow-sm shadow-primary/20 disabled:opacity-60"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="animate-pulse">Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                Request Reservation
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
            {receiptAppointment && (
                <AppointmentReceipt appointment={receiptAppointment} open={receiptOpen} onClose={handleReceiptClose} />
            )}
        </section>
    );
}

// --- Sub-components ---



function ContactLine({ icon, label, value }: { icon: React.ReactElement<any>; label: string; value?: string }) {
    const iconElem = React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 16 } as any) : icon;
    return (
        <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                {iconElem}
            </div>
            <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 leading-none mb-1">{label}</p>
                <p className="text-sm font-semibold text-stone-700">{value || 'N/A'}</p>
            </div>
        </div>
    );
}
