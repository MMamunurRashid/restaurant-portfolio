"use client";

import { ArrowRight, CalendarDays, Check, Star, UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import type { IPackage } from "@/interface/packageInterface";
import { useGetAllPackageQuery } from "@/redux/features/packages/packagesApi";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/utils/media";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ([0.22, 1, 0.36, 1] as any) } },
};

export default function FeaturedPackages() {
  const { data, isLoading } = useGetAllPackageQuery({ isFeatured: true, sort: 'order,createdAt' });
  const apiPackages: IPackage[] = data?.data || [];
  const packages = apiPackages;
  const showSkeleton = isLoading && !apiPackages.length;

  if (!showSkeleton && !packages.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-14 md:px-4 md:py-24">
      <div className="container relative z-10 mx-auto max-w-6xl">
        <motion.div
          className="mx-auto mb-14 max-w-2xl text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ([0.22, 1, 0.36, 1] as any) }}
        >
          <div className="mb-4 inline-flex items-center gap-2 border border-[#d75a3f]/25 bg-[#fff4ed] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#d75a3f]">
            <CalendarDays size={13} />
            Dining Packages
          </div>
          <h2 className="font-serif text-4xl font-normal leading-tight text-[#111827] md:text-6xl">
            Easy sets for dates, family dinners and celebrations
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600">
            Choose a ready-made experience or use it as a starting point for a custom reservation.
          </p>
        </motion.div>

        {showSkeleton && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[440px] rounded-lg bg-slate-100" />
            ))}
          </div>
        )}

        {!showSkeleton && packages.length > 0 && (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {packages.map((pkg) => (
              <motion.div key={pkg._id} variants={cardVariants} className="h-full">
                <article
                  className={`group flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 ${
                    pkg.isPopular ? "border-[#d75a3f]/45" : "border-slate-200 hover:border-[#1f4f46]/30"
                  }`}
                >
                  {pkg.thumbnail && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={getMediaUrl(pkg.thumbnail)}
                      alt={pkg.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#111827]/65 via-transparent to-transparent" />
                    {pkg.isPopular && (
                      <div className="absolute left-4 top-4 flex items-center gap-1.5 bg-[#d75a3f] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        <Star size={11} fill="currentColor" />
                        Popular
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      <h3 className="font-serif text-2xl font-normal leading-tight text-white">
                        {pkg.title}
                      </h3>
                      <div className="shrink-0 bg-white px-3 py-2 text-right">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">From</p>
                        <p className="text-sm font-black text-[#111827]">BDT {pkg.price.toLocaleString("en-BD")}</p>
                      </div>
                    </div>
                  </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    {!pkg.thumbnail && (
                      <div className="mb-5">
                        <h3 className="font-serif text-2xl font-normal leading-tight text-[#111827]">
                          {pkg.title}
                        </h3>
                        <p className="mt-2 text-sm font-black text-[#d75a3f]">
                          BDT {pkg.price.toLocaleString("en-BD")}
                        </p>
                      </div>
                    )}
                    {pkg.description && (
                      <p className="mb-5 text-sm leading-6 text-slate-600">
                        {pkg.description}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {(pkg.services || []).slice(0, 4).map((service, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[#1f4f46]/10 text-[#1f4f46]">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span className="text-sm leading-6 text-slate-600">
                            {service}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      <Link
                        to={`/appointment?package=${pkg.slug || pkg._id}`}
                        className="group/button flex w-full items-center justify-center gap-2 bg-[#111827] px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-[#1f4f46]"
                      >
                        <UtensilsCrossed size={16} />
                        Reserve Package
                        <ArrowRight size={15} className="transition-transform group-hover/button:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 border border-slate-200 px-5 py-3 text-sm font-bold text-[#1f4f46] transition-all hover:border-[#1f4f46]/40 hover:bg-[#f7f8f4]"
          >
            View all packages
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
