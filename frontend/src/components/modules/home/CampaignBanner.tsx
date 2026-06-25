import { motion } from "framer-motion";
import { useGetCampaignQuery } from "@/redux/features/campaign/campaignApi";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Flame } from "lucide-react";
import { getMediaUrl } from "@/utils/media";

export default function CampaignBanner() {
    const { data } = useGetCampaignQuery({});
    const campaign = data?.data;
    const titleWords = (campaign?.title || "").split(" ").filter(Boolean);
    const hasCampaignData = Boolean(
        campaign && (campaign.title || campaign.subTitle || campaign.description || campaign.image)
    );

    if (!hasCampaignData) return null;

    return (
        <section className="bg-neutral py-14 text-white md:px-4 md:py-24">
            <div className="container mx-auto max-w-6xl">
                <div className={`grid grid-cols-1 items-center gap-10 ${campaign.image ? "lg:grid-cols-2 lg:gap-14" : ""}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="order-2 lg:order-1"
                    >
                        {campaign.subTitle && (
                            <div className="mb-6 inline-flex items-center gap-2 border border-primary/80 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                <Flame size={13} />
                                {campaign.subTitle}
                            </div>
                        )}

                        {campaign.title && (
                        <h2 className="font-serif text-4xl font-normal leading-[1.08] text-white md:text-6xl">
                            {titleWords.slice(0, -2).join(" ")}{" "}
                            <span className="italic text-primary">
                                {titleWords.slice(-2).join(" ")}
                            </span>
                        </h2>
                        )}

                        {campaign.description && (
                            <p className="mt-6 max-w-xl text-sm leading-8 text-white/70">
                                {campaign.description}
                            </p>
                        )}

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link to="/appointment" className="w-full sm:w-auto">
                                <button className="group flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-secondary/90 sm:w-auto">
                                    <CalendarDays size={16} />
                                    Reserve This Offer
                                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </Link>

                            <Link
                                to="/packages"
                                className="flex w-full items-center justify-center border border-white/15 px-6 py-4 text-sm font-bold text-white/75 transition-all hover:border-primary/80 hover:text-white sm:w-auto"
                            >
                                View dining packages
                            </Link>
                        </div>
                    </motion.div>

                    {campaign.image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="order-1 overflow-hidden rounded-lg bg-white/5 lg:order-2"
                    >
                        <img
                            src={getMediaUrl(campaign.image)}
                            alt={campaign.title || "Campaign"}
                            className="h-[340px] w-full object-cover md:h-[460px]"
                            loading="lazy"
                        />
                    </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
