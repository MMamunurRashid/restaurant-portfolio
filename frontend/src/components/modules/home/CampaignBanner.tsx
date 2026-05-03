import { motion } from "framer-motion";
import { CONFIG } from "@/config";
import { useGetCampaignQuery } from "@/redux/features/campaign/campaignApi";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export default function CampaignBanner() {
    const { data, isLoading } = useGetCampaignQuery({});
    const campaign = data?.data;

    if (isLoading || !campaign) return null;

    return (
        <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800"
                >
                    {/* Glow blobs */}
                    <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#CC826C]/20 blur-[100px]" />
                    <div className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-rose-700/15 blur-[100px]" />

                    {/* Top accent line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#CC826C]/50 to-transparent" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* ── Left: Text ── */}
                        <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16 text-center lg:text-left">
                            {/* Live badge */}
                            <div className="mb-7 inline-flex items-center self-center lg:self-start gap-2.5 rounded-full border border-[#CC826C]/30 bg-[#CC826C]/12 px-4 py-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CC826C] opacity-60" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#CC826C]" />
                                </span>
                                <Zap size={11} className="text-[#CC826C]" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CC826C]">
                                    {campaign.subTitle}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-white mb-5">
                                {campaign.title.split(" ").slice(0, -2).join(" ")}{" "}
                                <span className="italic text-[#CC826C]">
                                    {campaign.title.split(" ").slice(-2).join(" ")}
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="text-sm leading-relaxed text-stone-400 max-w-sm mx-auto lg:mx-0 mb-10">
                                {campaign.description}
                            </p>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link to="/appointment">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="group flex items-center gap-2.5 rounded-2xl bg-[#CC826C] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#CC826C]/25 transition-colors duration-300 hover:bg-[#b8705a]"
                                    >
                                        Book Now
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </motion.button>
                                </Link>

                                <Link
                                    to="/packages"
                                    className="text-sm font-medium text-stone-400 hover:text-white underline underline-offset-4 decoration-stone-700 hover:decoration-stone-400 transition-all"
                                >
                                    View all packages
                                </Link>
                            </div>
                        </div>

                        {/* ── Right: Image ── */}
                        <div className="relative flex items-end justify-center lg:justify-end overflow-hidden min-h-[340px] lg:min-h-0">
                            {/* Decorative tinted bg behind image */}
                            <div className="absolute inset-0 bg-gradient-to-bl from-[#CC826C]/8 via-transparent to-transparent" />

                            {/* Offset card decoration */}
                            <div className="absolute bottom-8 right-8 left-8 h-3/4 rounded-3xl border border-white/6 bg-white/3 backdrop-blur-sm -rotate-2" />

                            <motion.div
                                initial={{ opacity: 0, y: 24, rotate: 4 }}
                                whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ rotate: 0, y: -6, transition: { duration: 0.4 } }}
                                className="relative z-10 m-10 lg:mr-14 lg:mb-0"
                            >
                                <img
                                    src={CONFIG.BASE_URL + campaign.image}
                                    alt={campaign.title}
                                    className="w-full max-w-xs lg:max-w-sm h-80 lg:h-[420px] object-cover rounded-3xl shadow-2xl shadow-black/40"
                                    loading="lazy"
                                />

                                {/* Gloss shimmer overlay */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

                                {/* Floating label on image */}
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="absolute -left-5 top-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 shadow-xl"
                                >
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-0.5">
                                        Limited Offer
                                    </p>
                                    <p className="text-sm font-semibold text-white">
                                        {campaign.subTitle}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}