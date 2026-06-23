import { useState } from "react";
import { CONFIG } from "@/config";
import type { IBlog } from "@/interface/blogInterface";
import { useGetAllBlogsQuery } from "@/redux/features/blog/blogApi";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/shared/Pagination";
import usePageView from "@/utils/usePageView";

const getDescriptionPreview = (htmlContent: string) => {
    const plainText = htmlContent?.replace(/<\/?[^>]+(>|$)/g, "") || "";
    return plainText.length > 120 ? plainText.slice(0, 120) + "..." : plainText;
};

export default function Blogs() {
    usePageView("Blogs");
    window.scrollTo(0, 0);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 9;

    const { data, isLoading, isFetching } = useGetAllBlogsQuery({
        isActive: true,
        page: currentPage,
        limit: limit
    });

    const blogs = data?.data || [];
    const meta = data?.meta;
    const totalPages = meta?.pages || 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-muted min-h-screen py-32 px-4">
            <div className="max-w-7xl mx-auto">

                {/* 1. Refined Header */}
                <header className="mb-10 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6"
                    >
                        The Editorial
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter text-primary"
                    >
                        JOURNAL
                    </motion.h1>
                </header>

                {/* 2. Content Section */}
                {isLoading || isFetching ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-4/5 bg-slate-100 rounded-2xl" />
                                <div className="h-4 w-1/2 bg-slate-100" />
                                <div className="h-8 w-full bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                            {blogs?.map((blog: IBlog, index: number) => (
                                <motion.article
                                    key={blog?._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index % 3 * 0.1 }}
                                    className="group"
                                >
                                    <Link to={`/blog/${blog?.slug}`} className="block">
                                        {/* Image Container with Floating Badge */}
                                        <div className="relative overflow-hidden rounded-4xl aspect-4/5 mb-4 bg-slate-100">
                                            <img
                                                src={CONFIG.BASE_URL + blog?.image}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                alt={blog?.title}
                                                loading="lazy"
                                            />
                                            <div className="absolute top-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                                                    <ArrowUpRight size={20} className="text-neutral" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meta & Title */}
                                        <div className="px-2 space-y-4">
                                            <h3 className="text-2xl font-bold tracking-tight text-neutral group-hover:text-primary transition-colors leading-snug">
                                                {blog?.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">
                                                {getDescriptionPreview(blog?.description)}
                                            </p>

                                            <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral border-b border-transparent group-hover:border-primary w-fit transition-all">
                                                Explore Story
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-32 flex justify-center border-t border-slate-100 pt-16">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}