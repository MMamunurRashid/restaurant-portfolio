import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { useGetAboutQuery } from "@/redux/features/about/aboutApi";
import { CONFIG } from "@/config";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

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
        const processedDescription = isAboutPage
            ? strippedDescription
            : strippedDescription.slice(0, 420) + "…";

        return {
            highlightTitle: titleWords.slice(-2).join(" "),
            remainingTitle: titleWords.slice(0, -2).join(" "),
            plainDescription: processedDescription,
        };
    }, [title, description, isAboutPage]);

    return (
        <section
            ref={containerRef}
            className="relative py-12 md:py-24 md:px-4 bg-linear-to-br from-white via-rose-50/30 to-orange-50/20 overflow-hidden"
        >
            {/* Background blobs */}
            <div className="pointer-events-none absolute -top-40 -right-40 h-125 w-125 rounded-full bg-[#CC826C]/6 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 -left-24 h-87.5 w-87.5 rounded-full bg-rose-200/15 blur-[100px]" />

            <div className="container relative z-10 mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── Left: Image ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        {/* Offset frame decoration */}
                        <div className="absolute -top-5 -left-5 w-full h-full rounded-[36px] border-2 border-[#CC826C]/15 z-0" />

                        {/* Main image */}
                        <div className="relative z-10 w-full aspect-4/5 overflow-hidden rounded-4xl shadow-xl shadow-stone-200/60">
                            <img
                                src={CONFIG.BASE_URL + about?.image}
                                alt="About Us"
                                className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-1000"
                                loading="lazy"
                            />
                            {/* Subtle linear at bottom */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

                            {/* Floating stat pill */}
                            {counters[0] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="absolute bottom-6 left-6 right-6"
                                >
                                    <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 px-5 py-4 flex items-center justify-between shadow-lg">
                                        {counters.slice(0, 3).map((item: any, i: number) => (
                                            <div key={i} className="text-center flex-1">
                                                <p className="font-sans text-xl font-bold text-stone-800 leading-none">
                                                    {item.count}
                                                    <span className="text-[#CC826C] text-sm">+</span>
                                                </p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mt-1">
                                                    {item.title}
                                                </p>
                                                {i < 2 && (
                                                    <div className="absolute top-1/4 h-1/2 w-px bg-stone-100" style={{ left: `${(i + 1) * 33.3}%` }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* ── Right: Content ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col"
                    >
                        {/* Eyebrow */}
                        <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-[#CC826C]/25 bg-[#CC826C]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#CC826C]">
                            <Sparkles size={12} />
                            {about?.subtitle || "Our Legacy"}
                        </div>

                        {/* Title */}
                        <h2 className="font-serif text-5xl font-normal leading-[1.08] tracking-tight text-stone-800 mb-6 md:text-6xl">
                            {remainingTitle}{" "}
                            <span className="italic text-[#CC826C]">
                                {highlightTitle}
                            </span>
                        </h2>

                        <Separator className="bg-stone-100 mb-8" />

                        {/* Description */}
                        <p className="text-sm leading-[1.9] text-stone-500 mb-10">
                            {plainDescription}
                        </p>

                        {/* Stats — only on non-about page (floating card covers on about page) */}
                        {!isAboutPage && counters.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-10">
                                {counters.slice(0, 3).map((item: any, i: number) => (
                                    <div
                                        key={i}
                                        className="group rounded-2xl border border-stone-100 bg-white p-2 md:p-4 text-center hover:border-[#CC826C]/25 hover:bg-[#CC826C]/4 transition-all duration-300"
                                    >
                                        <p className="font-sans text-2xl md:text-3xl font-bold text-stone-800 group-hover:text-[#CC826C] transition-colors leading-none">
                                            {item.count}
                                            <span className="text-[#CC826C] text-lg">+</span>
                                        </p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mt-2">
                                            {item.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        {!isAboutPage && (
                            <div className="flex items-center gap-8">
                                <Link to="/about-us" className="group flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full border border-primary flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white">
                                        <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-800">Learn More</span>
                                </Link>
                                <div className="hidden sm:block h-px flex-1 bg-slate-100" />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}