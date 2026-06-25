import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { useGetAboutQuery } from "@/redux/features/about/aboutApi";
import { ArrowUpRight, Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { getMediaUrl } from "@/utils/media";
import { useGetContactQuery } from "@/redux/features/contact/contactApi";
import type { ISocial } from "@/interface/contactInterface";
import {
    FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn,
    FaYoutube, FaWhatsapp, FaGithub, FaTiktok,
    FaPinterestP, FaSnapchatGhost, FaGlobe,
} from "react-icons/fa";

const iconMap: Record<string, React.ReactNode> = {
    facebook: <FaFacebookF size={14} />,
    instagram: <FaInstagram size={14} />,
    twitter: <FaTwitter size={14} />,
    linkedin: <FaLinkedinIn size={14} />,
    youtube: <FaYoutube size={14} />,
    whatsapp: <FaWhatsapp size={14} />,
    github: <FaGithub size={14} />,
    tiktok: <FaTiktok size={14} />,
    pinterest: <FaPinterestP size={14} />,
    snapchat: <FaSnapchatGhost size={14} />,
    default: <FaGlobe size={14} />,
};

export default function AboutCom() {
    const containerRef = useRef(null);
    const { data } = useGetAboutQuery({});
    const about = data?.data;

    const { data: contactData } = useGetContactQuery({});
    const contact = contactData?.data;

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
                            <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-slate-100 shadow-xl shadow-slate-200/60">
                                <img
                                    src={getMediaUrl(about.image)}
                                    alt={about?.title || "About"}
                                    className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-neutral/50 via-transparent to-transparent" />

                                {counters.length > 0 && (
                                    <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
                                        {counters.slice(0, 3).map((item: any, i: number) => (
                                            <div key={i} className="rounded-lg border border-white/30 bg-white/90 p-3 text-center backdrop-blur-sm">
                                                <p className="text-lg font-bold leading-none text-neutral">
                                                    {item.count}
                                                    <span className="text-primary">+</span>
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
                            <div className="mb-5 inline-flex items-center gap-2 self-start border border-primary/20 bg-muted px-4 py-2 text-xs font-bold uppercase tracking-widest text-secondary">
                                <Leaf size={13} />
                                {about.subtitle}
                            </div>
                        )}

                        {title && (
                            <h2 className="font-serif text-4xl font-normal leading-[1.08] text-neutral md:text-6xl">
                                {remainingTitle}{" "}
                                <span className="italic text-primary">
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
                                    <div key={i} className="rounded-lg border border-slate-200 bg-muted p-4">
                                        <p className="text-2xl font-bold leading-none text-neutral">
                                            {item.count}
                                            <span className="text-primary">+</span>
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
                                <Link to="/about-us" className="w-full max-w-[20rem] sm:w-auto">
                                    <button className="group flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-secondary sm:w-auto">
                                        Our Story
                                        <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </button>
                                </Link>
                                <div className="flex flex-wrap gap-2.5 sm:ml-4">
                                    {contact?.socials?.map((social: ISocial, i: number) => (
                                        <motion.a
                                            key={i}
                                            href={social.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            whileHover={{ y: -3 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-9 h-9 border border-primary/80 bg-primary/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:border-primary hover:text-white shadow-sm transition-colors duration-200"
                                        >
                                            {iconMap[social.icon?.toLowerCase()] ?? iconMap.default}
                                        </motion.a>
                                    ))}
                                </div>
                                <div className="hidden h-px flex-1 bg-slate-200 sm:block" />
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
