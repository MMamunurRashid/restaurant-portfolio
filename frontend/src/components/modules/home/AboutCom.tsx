import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { useGetAboutQuery } from "@/redux/features/about/aboutApi";
import { ArrowUpRight, Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { getMediaUrl } from "@/utils/media";

export default function AboutCom() {
    const containerRef = useRef(null);
    const { data } = useGetAboutQuery({});
    const about = data?.data;
    const counters = about?.stats?.length ? about.stats : [];
    const title = about?.title || "";
    const description = about?.description || "";

    const location = useLocation();
    const isAboutPage = location.pathname === "/about-us";

    const { remainingTitle, highlightTitle, plainDescription } = useMemo(() => {
        const titleWords = title.split(" ");
        const strippedDescription = description.replace(/<[^>]+>/g, "");
        const processedDescription = isAboutPage || strippedDescription.length <= 420
            ? strippedDescription
            : `${strippedDescription.slice(0, 420)}...`;

        return {
            highlightTitle: titleWords.slice(-2).join(" "),
            remainingTitle: titleWords.slice(0, -2).join(" "),
            plainDescription: processedDescription,
        };
    }, [title, description, isAboutPage]);

    const hasAboutData = Boolean(
        about && (about.title || about.subtitle || about.description || about.image || counters.length)
    );

    if (!hasAboutData) return null;

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden bg-white py-14 md:px-4 md:py-24"
        >
            <div className="container relative z-10 mx-auto max-w-6xl">
                <div className={`grid grid-cols-1 items-center gap-12 ${about?.image ? "lg:grid-cols-2 lg:gap-16" : ""}`}>
                    {about?.image && (
                    <motion.div
                        initial={{ opacity: 0, x: -32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 shadow-xl shadow-slate-200/60">
                            <img
                                src={getMediaUrl(about.image)}
                                alt={about?.title || "About"}
                                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#111827]/50 via-transparent to-transparent" />

                            {counters.length > 0 && (
                            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
                                {counters.slice(0, 3).map((item: any, i: number) => (
                                    <div key={i} className="rounded-lg border border-white/30 bg-white/90 p-3 text-center backdrop-blur-sm">
                                        <p className="text-lg font-bold leading-none text-[#111827]">
                                            {item.count}
                                            <span className="text-[#d75a3f]">+</span>
                                        </p>
                                        <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                            {item.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            )}
                        </div>
                    </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, x: 32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col"
                    >
                        {about?.subtitle && (
                        <div className="mb-5 inline-flex items-center gap-2 self-start border border-[#1f4f46]/20 bg-[#f7f8f4] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#1f4f46]">
                            <Leaf size={13} />
                            {about.subtitle}
                        </div>
                        )}

                        {title && (
                        <h2 className="font-serif text-4xl font-normal leading-[1.08] text-[#111827] md:text-6xl">
                            {remainingTitle}{" "}
                            <span className="italic text-[#1f4f46]">
                                {highlightTitle}
                            </span>
                        </h2>
                        )}

                        {title && description && <Separator className="my-7 bg-slate-200" />}

                        {description && (
                        <p className="text-sm leading-8 text-slate-600">
                            {plainDescription}
                        </p>
                        )}

                        {!about?.image && counters.length > 0 && (
                            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {counters.slice(0, 3).map((item: any, i: number) => (
                                    <div key={i} className="rounded-lg border border-slate-200 bg-[#f7f8f4] p-4">
                                        <p className="text-2xl font-bold leading-none text-[#111827]">
                                            {item.count}
                                            <span className="text-[#d75a3f]">+</span>
                                        </p>
                                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                            {item.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isAboutPage && (
                            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                                <Link to="/about-us" className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-[#111827]">
                                    Our Story
                                    <span className="flex h-11 w-11 items-center justify-center border border-[#1f4f46]/25 text-[#1f4f46] transition-all group-hover:bg-[#1f4f46] group-hover:text-white">
                                        <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
                                    </span>
                                </Link>
                                <div className="hidden h-px flex-1 bg-slate-200 sm:block" />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
