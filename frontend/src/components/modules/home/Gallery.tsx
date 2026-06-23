import { useGetAllGalleryQuery } from "@/redux/features/gallery/galleryApi";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Camera, ImageOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/utils/media";

export default function Gallery({ showAll = false, max = 6 }: { showAll?: boolean; max?: number }) {
    const [filter, setFilter] = useState("All");
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const { data, isLoading } = useGetAllGalleryQuery({ fields: "title,images" });
    const apiGalleries = useMemo(() => data?.data || [], [data?.data]);
    const galleries = useMemo(
        () => apiGalleries.filter((gallery: any) => gallery?.images?.some((imgObj: any) => imgObj?.image)),
        [apiGalleries]
    );
    const showSkeleton = isLoading && !apiGalleries.length;

    const categories = useMemo(() => {
        const titles = galleries.map((g: any) => g.title);
        return ["All", ...titles];
    }, [galleries]);

    const allImages = useMemo(() => {
        const imgs: any[] = [];
        galleries.forEach((gallery: any) => {
            gallery.images?.forEach((imgObj: any, i: number) => {
                if (!imgObj?.image) return;
                imgs.push({
                    id: `${gallery._id}-${i}`,
                    category: gallery.title,
                    image: getMediaUrl(imgObj.image),
                    title: imgObj?.title || gallery.title,
                });
            });
        });
        return imgs;
    }, [galleries]);

    const filteredImages = useMemo(
        () => (filter === "All" ? allImages : allImages.filter((img) => img.category === filter)),
        [filter, allImages]
    );

    const displayImages = showAll ? filteredImages : filteredImages.slice(0, max);

    if (!showSkeleton && !allImages.length) return null;

    if (showSkeleton) {
        return (
            <section className="bg-muted py-14 md:px-4 md:py-24">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {Array.from({ length: max }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[4/5] rounded-lg bg-slate-200/70 animate-pulse"
                                style={{ animationDelay: `${i * 0.07}s` }}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden bg-muted py-14 md:px-4 md:py-24">
            <div className="container relative z-10 mx-auto max-w-6xl">
                <motion.div
                    className="mx-auto mb-12 max-w-2xl text-center"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-4 inline-flex items-center gap-2 border border-secondary/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-secondary">
                        <Camera size={13} />
                        Gallery
                    </div>
                    <h2 className="font-serif text-4xl font-normal leading-tight text-neutral md:text-6xl">
                        A look inside Prestige
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600">
                        Interior details, plated favorites, coffee moments, and the dining atmosphere guests come back for.
                    </p>
                </motion.div>

                <motion.div
                    className="mb-10 flex flex-wrap justify-center gap-2"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                filter === cat
                                    ? "bg-secondary text-white"
                                    : "border border-slate-200 bg-white text-slate-500 hover:border-secondary/40 hover:text-secondary"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
                    <AnimatePresence mode="popLayout">
                        {displayImages.map((item, i) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                onClick={() => setSelectedImg(item.image)}
                                className={`group relative cursor-pointer overflow-hidden rounded-lg bg-slate-100 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/70 ${
                                    i === 0 && !showAll ? "md:col-span-2 md:row-span-2" : ""
                                }`}
                            >
                                <div className="aspect-[4/5] h-full w-full">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-linear-to-t from-neutral/70 via-neutral/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                                        {item.category}
                                    </p>
                                    <h3 className="font-serif text-lg font-normal leading-snug text-white md:text-xl">
                                        {item.title}
                                    </h3>
                                </div>

                                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-white text-secondary opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
                                    <ZoomIn size={15} />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredImages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-4 py-20"
                    >
                        <div className="border border-slate-200 bg-white p-5">
                            <ImageOff size={26} className="text-slate-300" />
                        </div>
                        <p className="font-serif text-lg italic text-slate-400">
                            No images in this category yet.
                        </p>
                    </motion.div>
                )}

                {!showAll && (
                    <div className="mt-10 text-center">
                        <Link
                            to="/gallery"
                            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-secondary transition-all hover:border-secondary/40"
                        >
                            View full gallery
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                        onClick={() => setSelectedImg(null)}
                    >
                        <button
                            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-white transition-all duration-200 hover:bg-primary"
                            onClick={() => setSelectedImg(null)}
                            aria-label="Close preview"
                        >
                            <X size={18} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative"
                        >
                            <img
                                src={selectedImg}
                                alt="Preview"
                                className="max-h-[85vh] max-w-full rounded-lg border border-white/10 object-contain shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
