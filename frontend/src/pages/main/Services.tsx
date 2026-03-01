import ServicesCard from '@/components/modules/home/ServicesCard';
import usePageView from '@/utils/usePageView';
import { motion } from 'framer-motion';


export default function ServicesPage() {
    usePageView("Services");
    window.scrollTo(0, 0);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
                <div className="container relative z-10">
                    <motion.h4
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-secondary font-bold uppercase tracking-[0.4em] text-xs mb-4"
                    >
                        Our Expertise
                    </motion.h4>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif italic text-white"
                    >
                        Exclusive <span className="not-italic font-sans font-black text-transparent bg-clip-text bg-linear-to-r from-secondary to-secondary/60">Beauty Services</span>
                    </motion.h1>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </section>


            <div className="container py-6">
                <ServicesCard />
            </div>
        </div>
    );
}