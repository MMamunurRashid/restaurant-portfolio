import { useGetAllServiceQuery } from "@/redux/features/service/serviceApi";
import { useState, useMemo } from "react";
import { CONFIG } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Sparkles, ImageOff } from "lucide-react";

export default function Gallery({ showAll = false, max = 6 }: { showAll?: boolean; max?: number }) {
    const [filter, setFilter] = useState("All");
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const { data, isLoading } = useGetAllServiceQuery({ fields: "title,galleries" });
    const services = useMemo(() => data?.data || [], [data?.data]);

    const categories = useMemo(() => {
        const titles = services.map((s: any) => s.title);
        return ["All", ...titles];
    }, [services]);

    const allImages = useMemo(() => {
        const imgs: any[] = [];
        services.forEach((service: any) => {
            service.galleries?.forEach((img: string, i: number) => {
                imgs.push({
                    id: `${service._id}-${i}`,
                    category: service.title,
                    image: CONFIG.BASE_URL + img,
                    title: service.title,
                });
            });
        });
        return imgs;
    }, [services]);

    const filteredImages = useMemo(
        () => (filter === "All" ? allImages : allImages.filter((img) => img.category === filter)),
        [filter, allImages]
    );

    const displayImages = showAll ? filteredImages : filteredImages.slice(0, max);

    if (isLoading) {
        return (
            <section className="py-24 px-4 bg-linear-to-br from-rose-50 via-white to-orange-50/20">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: max }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[4/5] rounded-3xl bg-stone-100 animate-pulse"
                                style={{ animationDelay: `${i * 0.07}s` }}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-4 bg-linear-to-br from-rose-50/40 via-white to-orange-50/20 relative overflow-hidden">
            {/* Blobs */}
            <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#CC826C]/6 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-[350px] w-[350px] rounded-full bg-rose-200/15 blur-[100px]" />

            <div className="container mx-auto max-w-6xl relative z-10">

                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#CC826C]/25 bg-[#CC826C]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#CC826C]">
                        <Sparkles size={12} />
                        Portfolio
                    </div>
                    <h2 className="font-serif text-5xl font-normal leading-tight tracking-tight text-stone-800 md:text-6xl">
                        The Beauty{" "}
                        <span className="italic text-[#CC826C]">Canvas</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-400">
                        A curated collection of our finest work — beauty captured, one frame at a time.
                    </p>
                </motion.div>

                {/* Filter tabs */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-12"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`relative px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                filter === cat
                                    ? "bg-[#CC826C] text-white shadow-md shadow-[#CC826C]/25"
                                    : "bg-white border border-stone-200 text-stone-400 hover:border-[#CC826C]/40 hover:text-[#CC826C]"
                            }`}
                        >
                            {filter === cat && (
                                <motion.span
                                    layoutId="filter-pill"
                                    className="absolute inset-0 rounded-full bg-[#CC826C] -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                                />
                            )}
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Image grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <AnimatePresence mode="popLayout">
                        {displayImages.map((item, i) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                onClick={() => setSelectedImg(item.image)}
                                className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer bg-stone-100 border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-shadow duration-400"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                                    loading="lazy"
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                                {/* Bottom info */}
                                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/60 mb-1">
                                        {item.category}
                                    </p>
                                    <h3 className="font-serif text-lg font-normal text-white leading-snug">
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Zoom button */}
                                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#CC826C] opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-md">
                                    <ZoomIn size={15} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty state */}
                {filteredImages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 gap-4"
                    >
                        <div className="rounded-full border border-stone-100 bg-stone-50 p-5">
                            <ImageOff size={26} className="text-stone-300" />
                        </div>
                        <p className="font-serif italic text-stone-400 text-lg">
                            No images in this category yet.
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4"
                        onClick={() => setSelectedImg(null)}
                    >
                        {/* Close */}
                        <button
                            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-[#CC826C] hover:border-[#CC826C] transition-all duration-200"
                            onClick={() => setSelectedImg(null)}
                        >
                            <X size={18} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.85, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative"
                        >
                            <img
                                src={selectedImg}
                                alt="Preview"
                                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10 object-contain"
                            />
                            {/* Gloss */}
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-transparent via-white/4 to-white/8 pointer-events-none" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}