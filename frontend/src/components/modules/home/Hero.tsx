import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllBannerQuery } from "@/redux/features/banner/bannerApi";
import { CONFIG } from "@/config";
import { Calendar, PhoneCall, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const { data, isLoading } = useGetAllBannerQuery({});
    const banners = data?.data || [];

    useEffect(() => {
        if (banners?.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === banners?.length - 1 ? 0 : prev + 1));
        }, 8000); // Optimized for salon vibe (8s)
        return () => clearInterval(timer);
    }, [banners?.length]);

    if (isLoading) return (
        <div className="h-screen w-screen bg-[#050505] flex items-center justify-center">
            <div className="relative">
                <div className="w-20 h-20 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary tracking-tighter animate-pulse">
                    GLOW UP
                </div>
            </div>
        </div>
    );

    if (banners?.length === 0) return null;
    const currentBanner = banners[current];

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
            {/* Background Layer with Parallax Effect */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={CONFIG.BASE_URL + currentBanner?.image}
                        alt="Salon & Spa"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    {/* Artistic Gradient Overlays */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="container h-full">
                <div className="pt-10 relative z-10 h-full flex flex-col justify-center items-center text-center">
                    <motion.div
                        key={`content-${current}`}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
                        }}
                        className="sm:max-w-4xl"
                    >
                        {/* Main Title - Serif & Sans Mix */}
                        <motion.h1
                            variants={{ hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            className="text-5xl md:text-8xl font-bold text-white leading-tight tracking-tight italic"
                        >
                            {currentBanner?.title.split(' ').slice(0, -1).join(' ')}{' '}
                            <span className="text-secondary not-italic font-black block md:inline-block">
                                {currentBanner?.title.split(' ').slice(-1)}
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            className="mt-8 text-gray-300/80 max-w-xl mx-auto text-lg leading-relaxed font-light tracking-wide"
                        >
                            {currentBanner?.description}
                        </motion.p>

                        {/* Button Group */}
                        <motion.div
                            variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            className="mt-12 flex flex-wrap items-center justify-center gap-5"
                        >
                            <Link to="/booking">
                                <button className="group relative px-8 py-4 bg-primary text-white font-bold rounded-full overflow-hidden transition-all hover:pr-12 shadow-xl shadow-primary/20">
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Calendar size={18} />
                                        Book Appointment
                                    </span>
                                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={20} />
                                </button>
                            </Link>

                            <Link to="/contact">
                                <button className="px-8 py-4 border border-secondary font-bold rounded-full backdrop-blur-md transition-all flex items-center gap-2 text-secondary">
                                    <PhoneCall size={18} />
                                    Contact Us
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}