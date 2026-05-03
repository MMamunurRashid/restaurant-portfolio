import { useParams } from 'react-router-dom';
import MainLayoutSkeleton from '@/components/shared/Skeleton/MainLayoutSkeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { CONFIG } from '@/config';
import { Sparkles, X, ZoomIn } from 'lucide-react';
import usePageView from '@/utils/usePageView';
import { useGetServiceBySlugQuery } from '@/redux/features/service/serviceApi';
import { useState } from 'react';

export default function ServiceDetails() {
    // window.scrollTo(0, 0);
    const { slug } = useParams();
    const { data, isLoading } = useGetServiceBySlugQuery(slug);
    const service = data?.data;

    const [selectedImg, setSelectedImg] = useState<string | null>(null);

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
                <div className="">

                    {/* 2. Left Side: Content & Galleries (Span 8) */}
                    <div className=" space-y-16">
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
                                {/* Image Grid */}
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    <AnimatePresence mode="popLayout">
                                                {service.galleries.map((img: string, idx: number) => (
                                                    <motion.div
                                                        key={idx}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ duration: 0.4 }}
                                                        whileHover={{ y: -5 }}
                                                        onClick={() => setSelectedImg(CONFIG.BASE_URL + img)}
                                                        className="relative group overflow-hidden rounded-[40px] aspect-4/5 cursor-pointer bg-slate-100 shadow-sm"
                                                    >
                                                        <img
                                                            src={CONFIG.BASE_URL + img}
                                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                                            alt={`Gallery ${idx}`}
                                                        />

                                                        {/* Overlay Effect */}
                                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                                <ZoomIn size={20} className="text-primary" />
                                                            </div>
                                                            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">{service.category}</p>
                                                            <h3 className="text-white font-serif italic text-xl">{service.title}</h3>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                    </AnimatePresence>
                                </motion.div>                        
                            </div>
                        )}
                    </div>
                    {/* --- LIGHTBOX MODAL --- */}
                    <AnimatePresence>
                        {selectedImg && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/95 p-4 backdrop-blur-md"
                                onClick={() => setSelectedImg(null)}
                            >
                                <button className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary transition-all">
                                    <X size={24} />
                                </button>

                                <motion.img
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    src={selectedImg}
                                    alt="Zoomed"
                                    className="max-w-full max-h-[85vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}