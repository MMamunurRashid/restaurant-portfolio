import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { useGetAboutQuery } from "@/redux/features/about/aboutApi";
import { CONFIG } from "@/config";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AboutCom() {
    const containerRef = useRef(null);
    const { data } = useGetAboutQuery({});
    const about = useMemo(() => data?.data ?? {}, [data]);
    const counters = about?.stats || [];
    const title = about?.title || "";
    const description = about?.description || "";

    const location = useLocation();
    const isAboutPage = location.pathname === "/about-us";

    const { remainingTitle, highlightTitle, plainDescription } = useMemo(() => {
        const titleWords = title?.split(" ") || [];

        const strippedDescription = description.replace(/<[^>]+>/g, "");

        // Logic: Jodi /about-us page hoy tahole full, nahole slice
        const processedDescription = isAboutPage
            ? strippedDescription
            : strippedDescription.slice(0, 600) + "...";


        return {
            highlightTitle: titleWords.slice(-2).join(" "),
            remainingTitle: titleWords.slice(0, -2).join(" "),
            plainDescription: processedDescription
        };
    }, [title, description, isAboutPage]);

    return (
        <section ref={containerRef} className="py-16 bg-[#fff5f776] overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">

                    {/* Left: Imagery Section (Span 6) */}
                    <div className="lg:col-span-6 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative flex justify-center lg:justify-start"
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

                            {/* Main Image Container */}
                            <div className="relative w-full aspect-4/5 max-w-120 overflow-hidden rounded-[40px] shadow-2xl shadow-primary/5">
                                <img
                                    src={CONFIG.BASE_URL + about?.image}
                                    alt="About GlowUp"
                                    className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-1000"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Textual Content (Span 6) */}
                    <div className="lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <span className="h-px w-8 bg-primary" />
                                <span className="text-primary font-black text-[11px] uppercase tracking-[0.4em]">
                                    {about?.subtitle || 'Our Legacy'}
                                </span>
                            </div>

                            <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] text-slate-900 mb-10 italic">
                                {remainingTitle}{' '}
                                <span className="not-italic font-sans font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
                                    {highlightTitle}
                                </span>
                            </h2>

                            <div className="relative mb-12">
                                <p className="text-slate-500 text-lg leading-relaxed font-light">
                                    {plainDescription}
                                </p>
                                {/* Decorative Quote Mark */}
                                <span className="absolute -top-6 -left-8 text-8xl text-primary/5 font-serif select-none">“</span>
                            </div>

                            {/* Minimal Stats Grid */}
                            <div className="grid grid-cols-3 gap-12 mb-12 border-y border-slate-100 py-10">
                                {counters.slice(0, 3).map((item: any, index: number) => (
                                    <div key={index} className="group">
                                        <h3 className="text-4xl font-black text-slate-800 transition-colors group-hover:text-primary">
                                            {item?.count}<span className="text-primary text-xl ml-1">+</span>
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">{item?.title}</p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Section */}
                            <div className="flex items-center gap-8">
                                <Link to="/about-us" className="group flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full border border-primary flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white">
                                        <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-800">Learn More</span>
                                </Link>
                                <div className="hidden sm:block h-px flex-1 bg-slate-100" />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}