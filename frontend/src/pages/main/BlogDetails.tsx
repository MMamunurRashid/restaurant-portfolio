import MainLayoutSkeleton from "@/components/shared/Skeleton/MainLayoutSkeleton";
import { CONFIG } from "@/config";
import type { IBlog } from "@/interface/blogInterface";
import { useGetBlogBySlugQuery } from "@/redux/features/blog/blogApi";
import usePageView from "@/utils/usePageView";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";


export default function BlogDetails() {
    window.scrollTo(0, 0);
    usePageView("Blog Details");
    const { slug } = useParams();
    const { data, isLoading } = useGetBlogBySlugQuery(slug!);
    const blogContent: IBlog = data?.data;

    if (isLoading) return <MainLayoutSkeleton />

    return (
        <div className="bg-white min-h-screen py-26">
            <div className="container mx-auto">
                {/* Back Button */}
                <Link to="/blogs" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-neutral transition-colors mb-6 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Journal
                </Link>

                {/* --- Header Section --- */}
                <div className="container text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                            {blogContent?.title}
                        </h1>
                    </motion.div>
                </div>

                {/* --- Main Image --- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full aspect-21/9 overflow-hidden bg-gray-100 my-8"
                >
                    <img
                        src={CONFIG.BASE_URL + blogContent?.image}
                        className="w-full h-full object-cover"
                        alt="Blog Cover"
                        loading="lazy"
                    />
                </motion.div>

                {/* --- Article Content --- */}
                <div className="container">
                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:p-8 prose-blockquote:italic text-gray-600 leading-relaxed drop-cap">
                        <div dangerouslySetInnerHTML={{ __html: blogContent?.description }} />
                    </div>
                </div>

            </div>
        </div>
    );
}