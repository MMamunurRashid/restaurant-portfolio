import { CONFIG } from '@/config';
import type { ITeam } from '@/interface/teamInterface';
import { useGetAllTeamQuery } from '@/redux/features/team/teamApi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllTeamCategoryQuery } from '@/redux/features/teamCategory/teamCategoryApi';
import type { ITeamCategory } from '@/interface/teamCategoryInterface';
import usePageView from '@/utils/usePageView';
import { Sparkles } from 'lucide-react';

export default function OurTeam() {
    usePageView("Our Team");
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const { data, isLoading } = useGetAllTeamQuery({
        category: activeCategory === 'All' ? '' : activeCategory,
    });
    const teamMembers = data?.data || [];

    const { data: category } = useGetAllTeamCategoryQuery({});
    const categories = category?.data || [];

    return (
        <section className="py-12 md:py-24 bg-white overflow-hidden relative">
            {/* Background Decorative Text */}
            <div className="absolute top-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
                <h2 className="text-[20vw] font-black uppercase leading-none whitespace-nowrap">
                    Creative Artists • Expert Stylists •
                </h2>
            </div>

            <div className="container mx-auto md:px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="h-px w-8 bg-primary" />
                        <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">The Creators</span>
                        <div className="h-px w-8 bg-primary" />
                    </motion.div>

                    <h2 className="text-6xl md:text-8xl font-serif italic text-slate-900 leading-tight">
                        Meet Our <br />
                        <span className="not-italic font-sans font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60 uppercase tracking-tighter">
                            Visionaries
                        </span>
                    </h2>
                </div>

                {/* Category Tabs (Minimalist Style) */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <CategoryButton
                        label="All Artists"
                        active={activeCategory === 'All'}
                        onClick={() => setActiveCategory('All')}
                    />
                    {categories?.map((cat: ITeamCategory) => (
                        <CategoryButton
                            key={cat?._id}
                            label={cat?.name}
                            active={activeCategory === cat?._id}
                            onClick={() => setActiveCategory(cat?._id)}
                        />
                    ))}
                </div>

                {/* Team Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    <AnimatePresence mode='popLayout'>
                        {teamMembers?.map((member: ITeam, idx: number) => (
                            <TeamCard key={member?._id} member={member} index={idx} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {teamMembers?.length === 0 && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 rounded-[40px] bg-slate-50 border border-dashed border-slate-200"
                    >
                        <Sparkles className="mx-auto mb-4 text-slate-300" size={32} />
                        <p className="text-slate-400 font-serif italic text-xl">Curating excellence for this category...</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

// Sub-components for cleaner structure
function CategoryButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2.5 md:px-8 md:py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border
                ${active
                    ? 'bg-primary text-white border-primary shadow-xl scale-105'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-primary hover:text-primary'
                }`}
        >
            {label}
        </button>
    );
}

function TeamCard({ member, index }: { member: ITeam, index: number }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group"
        >
            <div className="relative aspect-3/4 overflow-hidden rounded-4xl mb-6 shadow-sm">
                {/* Image */}
                <img
                    src={`${CONFIG.BASE_URL}${member?.image}`}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    alt={member?.name}
                />

                {/* Subtle Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Member Info */}
            <div className="text-center space-y-2">
                <h4 className="font-serif italic text-2xl text-slate-900 group-hover:text-primary transition-colors duration-300">
                    {member?.name}
                </h4>
                <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-4 bg-primary/30 group-hover:w-8 transition-all" />
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
                        {member?.designation}
                    </span>
                    <div className="h-px w-4 bg-primary/30 group-hover:w-8 transition-all" />
                </div>
            </div>
        </motion.div>
    );
}