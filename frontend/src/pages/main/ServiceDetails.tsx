import { Link, useParams } from 'react-router-dom';
import MainLayoutSkeleton from '@/components/shared/Skeleton/MainLayoutSkeleton';
import { motion } from 'framer-motion';
import { CONFIG } from '@/config';
import { Clock, Sparkles } from 'lucide-react';
import usePageView from '@/utils/usePageView';
import { useGetServiceBySlugQuery } from '@/redux/features/service/serviceApi';

export default function ServiceDetails() {
    window.scrollTo(0, 0);
    const { slug } = useParams();
    const { data, isLoading } = useGetServiceBySlugQuery(slug);
    const service = data?.data;

    usePageView(service?.title || "Service Details");

    if (isLoading) return <MainLayoutSkeleton />;
    if (!service) return <div className="py-40 text-center font-serif italic text-2xl">Service not found.</div>;

    return (
        <section className="bg-white min-h-screen">
            {/* 1. Dynamic Hero Header */}
            <div className="relative h-[60vh] min-h-100 w-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={CONFIG.BASE_URL + service.thumbnail}
                    className="w-full h-full object-cover"
                    alt={service.title}
                />
                <div className="absolute inset-0 bg-linear-to-t from-white via-slate-900/40 to-slate-900/20" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
                    <div className="container mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-3xl"
                        >
                            <span className="inline-flex items-center gap-2 bg-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-6">
                                <Sparkles size={12} /> Special Treatment
                            </span>
                            <h1 className="text-5xl md:text-8xl font-serif italic text-white drop-shadow-2xl">
                                {service.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* 2. Left Side: Content & Galleries (Span 8) */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Description */}
                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-3xl font-serif italic text-slate-900 mb-6 flex items-center gap-4">
                                About Service <div className="h-px flex-1 bg-slate-100" />
                            </h2>
                            <div
                                className="text-slate-600 text-lg leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-primary"
                                dangerouslySetInnerHTML={{ __html: service.description }}
                            />
                        </div>

                        {/* Galleries Grid */}
                        {service?.galleries && service?.galleries?.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-serif italic text-slate-900 mb-6 flex items-center gap-4">
                                    Service Portfolio <div className="h-px flex-1 bg-slate-100" />
                                </h2>
                                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                    {service.galleries.map((img: string, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ y: -5 }}
                                            className="rounded-3xl overflow-hidden shadow-sm"
                                        >
                                            <img
                                                src={CONFIG.BASE_URL + img}
                                                className="w-full object-cover"
                                                alt={`Gallery ${idx}`}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Right Side: Sticky Sidebar (Span 4) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            {/* Booking Card */}
                            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-all duration-700" />

                                <h3 className="text-3xl font-serif italic mb-6 relative z-10">Book an Appointment</h3>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-4 text-slate-300 border-b border-white/10 pb-4">
                                        <Clock size={20} className="text-primary" />
                                        <span className="text-sm">Duration: Flexible / Expert Choice</span>
                                    </div>

                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        Ready for your transformation? Connect with our experts directly or send us an inquiry.
                                    </p>

                                    <div className="pt-4 space-y-4">
                                        <Link
                                            to="/contact-us"
                                            className="w-full bg-primary text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-primary transition-all duration-500"
                                        >
                                            Contact Us
                                        </Link>
                                        <Link to="/appointment" className="w-full bg-white/10 backdrop-blur-md text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all border border-white/10">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}