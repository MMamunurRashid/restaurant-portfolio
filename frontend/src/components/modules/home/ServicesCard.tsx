import { motion } from "framer-motion";
import { CONFIG } from "@/config";
import type { IService } from "@/interface/serviceInterface";
import { useGetAllServiceQuery } from "@/redux/features/service/serviceApi";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: ([0.22, 1, 0.36, 1] as any) },
    }),
};

export default function ServicesCard() {
    const { data } = useGetAllServiceQuery({});
    const services: IService[] = data?.data || [];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, i) => {
                const plainDesc = service.description
                    ? service.description.replace(/<[^>]+>/g, "").slice(0, 72) + "…"
                    : "";

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
                            to={`/service/${service.slug}`}
                            className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-100 hover:-translate-y-1.5 transition-all duration-400 h-full"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={CONFIG.BASE_URL + service.thumbnail}
                                    alt={service.title}
                                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                {/* Gradient fade */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                                {/* Icon badge */}
                                <div className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center overflow-hidden border border-white">
                                    <img
                                        src={CONFIG.BASE_URL + service.icon}
                                        alt={service.title}
                                        className="w-7 h-7 object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Bottom label on image */}
                                <div className="absolute bottom-4 left-4">
                                    <span className="inline-block rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                                        Beauty Service
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-6">
                                <h3 className="font-serif text-lg font-normal text-stone-800 mb-2 group-hover:text-[#CC826C] transition-colors duration-300 leading-snug">
                                    {service.title}
                                </h3>

                                <p className="text-xs leading-relaxed text-stone-400 flex-1 mb-5">
                                    {plainDesc}
                                </p>

                                {/* CTA row */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#CC826C] border-b border-[#CC826C]/30 pb-0.5 group-hover:border-[#CC826C] transition-colors">
                                        Explore
                                    </span>
                                    <span className="w-8 h-8 rounded-full border border-stone-100 bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-[#CC826C] group-hover:border-[#CC826C] group-hover:text-white transition-all duration-300">
                                        <ArrowUpRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}