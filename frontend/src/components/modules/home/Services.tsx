import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import ServicesCard from "./ServicesCard";
import { useGetAllServiceQuery } from "@/redux/features/service/serviceApi";
import type { IService } from "@/interface/serviceInterface";

export default function Services() {
    const { data } = useGetAllServiceQuery({ sort: 'order,createdAt' });
    const services: IService[] = (data?.data || []).filter((service: IService) => service.isActive !== false);

    if (!services.length) return null;

    return (
        <section className="relative overflow-hidden bg-muted py-14 md:px-4 md:py-24">
            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    className="mx-auto mb-14 max-w-2xl text-center"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 border border-secondary/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-secondary">
                        <ChefHat size={13} />
                        Signature Menu
                    </div>
                    <h2 className="font-serif text-4xl font-normal leading-tight text-neutral md:text-6xl">
                        Cafe classics, plated with a restaurant finish
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600">
                        A concise menu for coffee breaks, brunch plans, business lunches, family dinners, and celebration tables.
                    </p>
                </motion.div>

                <ServicesCard services={services} />
            </div>
        </section>
    );
}
