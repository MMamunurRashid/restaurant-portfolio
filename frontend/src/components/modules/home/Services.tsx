import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ServicesCard from "./ServicesCard";

export default function Services() {
    return (
        <section className="py-24 px-4 bg-rose-50/30 relative overflow-hidden">
            {/* bg blobs */}
            <div className="pointer-events-none absolute top-0 right-0 h-100 w-100 rounded-full bg-[#CC826C]/6 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-75 w-75 rounded-full bg-rose-200/15 blur-[80px]" />

            <div className="container relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#CC826C]/25 bg-[#CC826C]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#CC826C]">
                        <Sparkles size={12} />
                        Our Expertise
                    </div>
                    <h2 className="font-serif text-5xl font-normal leading-tight tracking-tight text-stone-800 md:text-6xl">
                        Exclusive{" "}
                        <span className="italic text-[#CC826C]">Beauty Services</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-stone-500">
                        From everyday care to luxury treatments, discover services tailored to make you feel your best.
                    </p>
                </motion.div>

                <ServicesCard />
            </div>
        </section>
    );
}