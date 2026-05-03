import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ServicesCard from "@/components/modules/home/ServicesCard";
import usePageView from "@/utils/usePageView";

export default function ServicesPage() {
    usePageView("Services");
    window.scrollTo(0, 0);

    return (
        <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-orange-50/20">

            {/* Hero */}
            <section className="relative py-28 px-4 overflow-hidden">
                {/* Blobs */}
                <div className="pointer-events-none absolute -top-32 -right-32 h-125 w-125 rounded-full bg-[#CC826C]/10 blur-[120px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-75 w-75 rounded-full bg-rose-200/20 blur-[80px]" />

                {/* Thin accent line */}
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#CC826C]/30 to-transparent" />

                <div className="container relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#CC826C]/25 bg-[#CC826C]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#CC826C]">
                            <Sparkles size={12} />
                            Our Expertise
                        </div>
                        <h1 className="font-serif text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-stone-800">
                            Exclusive{" "}
                            <span className="italic text-[#CC826C]">Beauty Services</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-stone-500">
                            Explore our full range of premium beauty and wellness services, crafted to bring out your natural glow.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cards */}
            <section className="pb-24 px-4">
                <div className="container">
                    <ServicesCard />
                </div>
            </section>
        </div>
    );
}