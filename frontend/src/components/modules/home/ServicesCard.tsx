import { motion } from "framer-motion";
import type { IService } from "@/interface/serviceInterface";
import { useGetAllServiceQuery } from "@/redux/features/service/serviceApi";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getMediaUrl } from "@/utils/media";

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: ([0.22, 1, 0.36, 1] as any) },
    }),
};

export default function ServicesCard({ services: providedServices }: { services?: IService[] } = {}) {
    const { data } = useGetAllServiceQuery({ sort: 'order,createdAt' }, { skip: Boolean(providedServices) });
    const apiServices: IService[] = providedServices ?? data?.data ?? [];
    const services = apiServices.filter((service) => service.isActive !== false);

    if (!services.length) return null;

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => {
                const plainDesc = service.description
                    ? service.description.replace(/<[^>]+>/g, "").slice(0, 92)
                    : "";
                const href = service.slug ? `/service/${service.slug}` : "/services";

                return (
                    <motion.div
                        key={service._id}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-40px" }}
                    >
                        <Link
                            to={href}
                            className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-xl hover:shadow-slate-200/60"
                        >
                            {service.thumbnail && (
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <img
                                    src={getMediaUrl(service.thumbnail)}
                                    alt={service.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />

                                {service.icon && (
                                <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center border border-white/40 bg-white/90 text-secondary backdrop-blur-sm">
                                    <img
                                        src={getMediaUrl(service.icon)}
                                        alt=""
                                        className="h-7 w-7 object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                )}

                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
                                        Menu Highlight
                                    </span>
                                    <span className="flex h-8 w-8 items-center justify-center border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-primary">
                                        <ArrowUpRight size={14} />
                                    </span>
                                </div>
                            </div>
                            )}

                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="font-serif text-xl font-normal leading-snug text-neutral transition-colors duration-300 group-hover:text-secondary">
                                    {service.title}
                                </h3>

                                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                                    {plainDesc}
                                    {plainDesc.length >= 92 ? "..." : ""}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                                        {service.price ? `BDT ${service.price.toLocaleString("en-BD")}` : "View details"}
                                    </span>
                                    <ArrowUpRight size={16} className="text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
