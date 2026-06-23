import { motion } from "framer-motion";
import { useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import ServicesCard from "@/components/modules/home/ServicesCard";
import usePageView from "@/utils/usePageView";

export default function ServicesPage() {
    usePageView("Services");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#f7f8f4]">

            {/* Hero */}
            <section className="relative py-14 md:py-28 md:px-4 overflow-hidden">
                {/* Thin accent line */}
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#d75a3f]/30 to-transparent" />

                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d75a3f]/25 bg-[#d75a3f]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#d75a3f]">
                            <UtensilsCrossed size={12} />
                            Menu Highlights
                        </div>
                        <h1 className="font-serif text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-stone-800">
                            Signature{" "}
                            <span className="italic text-[#d75a3f]">Cafe Menu</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-stone-500">
                            Explore chef-led plates, fresh coffee, house desserts, and relaxed dining favorites crafted for every visit.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cards */}
            <section className="pb-12 md:pb-24 md:px-4">
                <div className="container">
                    <ServicesCard />
                </div>
            </section>
        </div>
    );
}
