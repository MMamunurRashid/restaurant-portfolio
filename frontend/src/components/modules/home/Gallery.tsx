import { useGetAllServiceQuery } from "@/redux/features/service/serviceApi";
import { useState, useMemo } from "react";
import { CONFIG } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

export default function Gallery({ showAll = false, max = 6 }: { showAll?: boolean; max?: number; }) {
  const [filter, setFilter] = useState("All");
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Fetching services with galleries
  const { data, isLoading } = useGetAllServiceQuery({ fields: "title,galleries" });
  const services = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  // 1. Dynamic Categories (Service Titles)
  const categories = useMemo(() => {
    const serviceTitles = services.map((s: any) => s.title);
    return ["All", ...serviceTitles];
  }, [services]);

  // 2. Flatten all galleries for "All" filter and format data
  const allImages = useMemo(() => {
    const images: any[] = [];
    services.forEach((service: any) => {
      service.galleries?.forEach((img: string, index: number) => {
        images.push({
          id: `${service._id}-${index}`,
          category: service.title,
          image: CONFIG.BASE_URL + img,
          title: service.title,
        });
      });
    });
    return images;
  }, [services]);

  // 3. Filtered Images Logic
  const filteredImages = useMemo(() => {
    return filter === "All"
      ? allImages
      : allImages.filter((img) => img.category === filter);
  }, [filter, allImages]);

  if (isLoading) return <div className="py-20 text-center text-gray-400 uppercase tracking-widest text-xs">Loading Gallery...</div>;
  const displayImages = showAll ? filteredImages : filteredImages.slice(0, max);

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h4
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-black tracking-[0.4em] uppercase text-[10px] mb-4"
          >
            Portfolio
          </motion.h4>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic text-slate-900 leading-tight"
          >
            The Beauty <span className="not-italic font-sans font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">Canvas</span>
          </motion.h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500 border ${filter === cat
                ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105"
                : "border-slate-100 text-slate-400 hover:border-primary hover:text-primary"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayImages.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedImg(item.image)}
                className="relative group overflow-hidden rounded-[40px] aspect-4/5 cursor-pointer bg-slate-100"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Overlay Effect */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <ZoomIn size={20} className="text-primary" />
                  </div>
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">{item.category}</p>
                  <h3 className="text-white font-serif italic text-xl">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-slate-300 italic font-serif text-xl">
            No images found in this category.
          </div>
        )}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/95 p-4 backdrop-blur-md"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary transition-all">
              <X size={24} />
            </button>

            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImg}
              alt="Zoomed"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}