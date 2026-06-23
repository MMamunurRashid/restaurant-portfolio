import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllBannerQuery } from "@/redux/features/banner/bannerApi";
import { useGetContactQuery } from "@/redux/features/contact/contactApi";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    MapPin,
    PhoneCall,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/utils/media";

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const { data } = useGetAllBannerQuery({});
    const { data: contactData } = useGetContactQuery({});
    const banners = (data?.data || []).filter((item: any) => item?.image);
    const banner = banners[current] || banners[0];
    const contact = contactData?.data;
    const displayPhone = contact?.phone?.split("|")?.[0]?.trim();
    const displayAddress = contact?.address?.trim();
    const openingHour = contact?.officeHours?.find((item: any) => item?.day && item?.hours);
    const hasContactBar = Boolean(displayPhone || displayAddress || openingHour);
    const highlights = Array.isArray(banner?.highlights)
        ? banner.highlights.filter((item: string) => item?.trim())
        : [];

    useEffect(() => {
        if (current >= banners.length) setCurrent(0);
    }, [banners.length, current]);

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

    const slideVariants = {
        enter: (_dir: number) => ({ y: 18, opacity: 0 }),
        center: { y: 0, opacity: 1, transition: { duration: 0.65, ease: ([0.22, 1, 0.36, 1] as any) } },
        exit: () => ({
            y: -12,
            opacity: 0,
            transition: { duration: 0.42, ease: ([0.22, 1, 0.36, 1] as any) },
        }),
    };

    const imageVariants = {
        enter: { scale: 1.06, opacity: 0 },
        center: { scale: 1, opacity: 1, transition: { duration: 1.2, ease: ("easeOut" as any) } },
        exit: { scale: 1.03, opacity: 0, transition: { duration: 0.5 } },
    };

    if (!banners.length) return null;

    return (
        <section className="relative mt-16 min-h-[calc(100svh-8rem)] overflow-hidden bg-[#111827] text-white md:mt-[72px] md:min-h-[calc(100svh-9rem)]">
            <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                    key={banner?._id || current}
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    src={getMediaUrl(banner?.image)}
                    alt={banner?.title || "Banner"}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-linear-to-r from-[#111827]/90 via-[#111827]/62 to-[#111827]/18" />
            <div className="absolute inset-0 bg-linear-to-t from-[#111827]/78 via-transparent to-[#111827]/18" />

            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-[1250px] items-center px-6 py-12 md:min-h-[calc(100svh-9rem)] md:px-8 md:py-16 xl:px-0">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`hero-copy-${current}`}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full min-w-0 max-w-[calc(100vw-3rem)] md:max-w-3xl"
                    >
                        <h1 className="max-w-[18rem] break-words font-serif text-4xl font-normal leading-[1.02] text-white sm:max-w-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                            {banner?.title}
                        </h1>

                        {banner?.description && (
                            <p className="mt-6 max-w-[18rem] text-sm leading-7 text-white/75 sm:max-w-2xl md:text-base md:leading-8">
                                {banner.description}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link to="/appointment" className="w-full max-w-[20rem] sm:w-auto">
                                <button className="group flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-secondary sm:w-auto">
                                    Reserve a Table
                                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </Link>

                            <Link to="/services" className="w-full max-w-[20rem] sm:w-auto">
                                <button className="flex w-full items-center justify-center gap-2 border border-white/25 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#f6e7d8]/70 hover:bg-white/15 sm:w-auto">
                                    Explore Menu
                                    <Coffee size={16} />
                                </button>
                            </Link>
                        </div>

                        {highlights.length > 0 && (
                            <div className="mt-8 flex flex-wrap gap-2">
                                {highlights.map((item: string) => (
                                    <span
                                        key={item}
                                        className="border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {hasContactBar && (
            <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/12 bg-[#111827]/55 backdrop-blur-md">
                <div className="container flex flex-col gap-3 py-4 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
                    {openingHour && (
                        <div className="flex items-center gap-2">
                            <Clock size={15} className="text-[#f6e7d8]" />
                            <span>{openingHour.day}: {openingHour.hours}</span>
                        </div>
                    )}
                    {displayAddress && (
                        <div className="flex items-center gap-2">
                            <MapPin size={15} className="text-[#f6e7d8]" />
                            <span>{displayAddress}</span>
                        </div>
                    )}
                    {displayPhone && (
                        <a href={`tel:${displayPhone}`} className="flex items-center gap-2 transition-colors hover:text-[#f6e7d8]">
                            <PhoneCall size={15} className="text-[#f6e7d8]" />
                            <span>{displayPhone}</span>
                        </a>
                    )}
                </div>
            </div>
            )}

            {banners.length > 1 && (
                <>
                    <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
                        <button
                            onClick={prev}
                            aria-label="Previous slide"
                            className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next slide"
                            className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-20">
                        {banners.map((_: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-2 transition-all duration-300 ${
                                    i === current ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/70"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
