import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllBannerQuery } from "@/redux/features/banner/bannerApi";
import { CONFIG } from "@/config";
import { Calendar, PhoneCall, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const { data, isLoading } = useGetAllBannerQuery({});
    const banners = data?.data || [];

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 7000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const goTo = (idx: number) => {
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
    };

    const prev = () => {
        setDirection(-1);
        setCurrent((p) => (p === 0 ? banners.length - 1 : p - 1));
    };

    const next = () => {
        setDirection(1);
        setCurrent((p) => (p === banners.length - 1 ? 0 : p + 1));
    };

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-rose-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#CC826C]/20 border-t-[#CC826C] animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#CC826C] animate-pulse">
                    Loading
                </p>
            </div>
        </div>
    );

    if (!banners.length) return null;

    const banner = banners[current];

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1, transition: { duration: 0.7, ease: ([0.22, 1, 0.36, 1] as any) } },
        exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.5, ease: ([0.22, 1, 0.36, 1] as any) } }),
    };

    const imageVariants = {
        enter: { scale: 1.1, opacity: 0 },
        center: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: ("easeOut" as any) } },
        exit: { scale: 1.05, opacity: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="relative h-screen min-h-150 w-full overflow-hidden bg-stone-100 mt-16 md:mt-18">

            {/* ── Mobile: full-bleed image behind text ── */}
            <div className="absolute inset-0 md:hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`mobile-img-${current}`}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0"
                    >
                        <img
                            src={CONFIG.BASE_URL + banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Stronger linear so text is always readable */}
                        <div className="absolute inset-0 bg-linear-to-t from-white via-white/90 to-white/30" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Desktop: split layout ── */}
            <div className="absolute inset-0 hidden md:grid md:grid-cols-2">

                {/* Right: image panel (rendered first in DOM for stacking, shown on right via grid) */}
                <div className="relative overflow-hidden order-2">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`img-${current}`}
                            custom={direction}
                            variants={imageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0"
                        >
                            <img
                                src={CONFIG.BASE_URL + banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-white/20 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Image overlay label */}
                    <div className="absolute bottom-8 left-8 z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`label-${current}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.5 }}
                                className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 px-5 py-3"
                            >
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-0.5">
                                    Featured
                                </p>
                                <p className="text-sm font-semibold text-white">
                                    {banner.title}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Prev / Next arrows — desktop only */}
                    {banners.length > 1 && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-6 z-10 flex flex-col gap-3">
                            <button
                                onClick={prev}
                                aria-label="Previous slide"
                                className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Next slide"
                                className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Left: text panel — desktop */}
                <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white/95 backdrop-blur-sm order-1">
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-[#CC826C]/40 to-transparent" />

                    <motion.p
                        key={`num-${current}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 font-mono text-xs text-stone-300 tracking-widest select-none"
                    >
                        <span className="text-[#CC826C] font-bold">0{current + 1}</span>
                        {" "}/ 0{banners.length}
                    </motion.p>

                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={`tag-${current}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#CC826C]/25 bg-[#CC826C]/8 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#CC826C] mb-6">
                                ✦ Beauty & Wellness
                            </span>

                            <h1 className="font-serif text-5xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-stone-800">
                                {banner.title.split(' ').slice(0, -1).join(' ')}{' '}
                                <em className="text-[#CC826C] not-italic">
                                    {banner.title.split(' ').slice(-1)}
                                </em>
                            </h1>

                            <p className="mt-6 text-sm leading-relaxed text-stone-500 max-w-sm">
                                {banner.description}
                            </p>

                            <div className="mt-10 flex flex-wrap items-center gap-4">
                                <Link to="/appointment">
                                    <button className="group relative flex items-center gap-2.5 rounded-2xl bg-[#CC826C] px-7 py-4 text-sm font-semibold text-white shadow-md shadow-[#CC826C]/25 transition-all duration-300 hover:bg-[#b8705a] hover:shadow-lg hover:shadow-[#CC826C]/30 overflow-hidden">
                                        <Calendar size={16} className="shrink-0" />
                                        Book Appointment
                                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </button>
                                </Link>

                                <Link to="/contact">
                                    <button className="flex items-center gap-2.5 rounded-2xl border-2 border-stone-200 bg-transparent px-7 py-4 text-sm font-semibold text-stone-600 transition-all duration-300 hover:border-[#CC826C]/40 hover:text-[#CC826C] hover:bg-[#CC826C]/5">
                                        <PhoneCall size={16} className="shrink-0" />
                                        Contact Us
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-14 flex items-center gap-2.5">
                        {banners.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`transition-all duration-400 rounded-full ${
                                    i === current
                                        ? 'w-8 h-2 bg-[#CC826C]'
                                        : 'w-2 h-2 bg-stone-200 hover:bg-stone-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Mobile: text content (sits above the bleed image) ── */}
            <div className="relative z-10 flex flex-col justify-end h-full pb-12 px-6 md:hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`mobile-content-${current}`}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#CC826C]/25 bg-[#CC826C]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#CC826C] mb-4 w-fit">
                            ✦ Beauty & Wellness
                        </span>

                        <h1 className="font-serif text-4xl font-normal leading-[1.1] tracking-tight text-stone-800">
                            {banner.title.split(' ').slice(0, -1).join(' ')}{' '}
                            <em className="text-[#CC826C] not-italic">
                                {banner.title.split(' ').slice(-1)}
                            </em>
                        </h1>

                        <p className="mt-3 text-sm leading-relaxed text-stone-500 line-clamp-2">
                            {banner.description}
                        </p>

                        {/* Mobile CTAs — full width stack on very small screens, row on sm */}
                        <div className="mt-6 flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
                            <Link to="/appointment" className="flex-1 xs:flex-none">
                                <button className="w-full xs:w-auto group flex items-center justify-center gap-2 rounded-xl bg-[#CC826C] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#CC826C]/25 transition-all duration-300 active:scale-95">
                                    <Calendar size={15} className="shrink-0" />
                                    Book Appointment
                                </button>
                            </Link>

                            <Link to="/contact" className="flex-1 xs:flex-none">
                                <button className="w-full xs:w-auto flex items-center justify-center gap-2 rounded-xl border-2 border-stone-300 bg-white/70 backdrop-blur-sm px-5 py-3.5 text-sm font-semibold text-stone-600 transition-all duration-300 active:scale-95">
                                    <PhoneCall size={15} className="shrink-0" />
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Mobile: dots + arrows row */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {banners.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`transition-all duration-300 rounded-full ${
                                    i === current
                                        ? 'w-7 h-2 bg-[#CC826C]'
                                        : 'w-2 h-2 bg-stone-300'
                                }`}
                            />
                        ))}
                    </div>

                    {banners.length > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prev}
                                aria-label="Previous slide"
                                className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 active:scale-95 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Next slide"
                                className="w-9 h-9 rounded-full bg-[#CC826C] flex items-center justify-center text-white active:scale-95 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}