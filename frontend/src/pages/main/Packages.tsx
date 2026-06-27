"use client";

import { useEffect, useState } from "react";
import { Check, Star, Zap, ArrowRight, Search, PackageOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllPackageQuery } from "@/redux/features/packages/packagesApi";
import type { IPackage } from "@/interface/packageInterface";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/utils/media";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: ([0.22, 1, 0.36, 1] as any) } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function AllPackagesPage() {
  const [search, setSearch] = useState("");


  const { data, isLoading } = useGetAllPackageQuery({ sort: 'order,createdAt' });
  const packages: IPackage[] = data?.data || [];

  const filtered = packages.filter((pkg) =>
    pkg.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-muted px-4  py-10 md:py-20 relative overflow-x-hidden">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Page Hero */}
        <motion.div
          className="py-20 max-w-2xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: ([0.22, 1, 0.36, 1] as any) }}
        >
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Dining Packages
          </p>
          <h1 className="font-serif text-5xl font-normal leading-[1.1] tracking-tight text-stone-800 md:text-6xl">
            Find Your{" "}
            <span className="italic text-primary">Signature</span>
            <br />
            Dining Experience
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-stone-500">
            From relaxed brunch sets to private dinner menus, every package is
            built for easy hosting and memorable tables.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search dining packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
        </motion.div>

        {/* Stats bar */}
        {!isLoading && packages.length > 0 && (
          <motion.div
            className="mb-12 flex w-fit items-center gap-1 md:gap-8 rounded-2xl border border-stone-200 bg-white/80 backdrop-blur-sm px-8 py-5 shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {[
              { num: packages.length, label: "Dining Packages" },
              { num: packages.filter((p) => p.isPopular).length, label: "Popular" },
              { num: packages.filter((p) => p.isFeatured).length, label: "Featured" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans text-3xl font-bold tracking-tight text-primary leading-none">
                    {stat.num}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                    {stat.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <Separator orientation="vertical" className="h-9 bg-stone-100" />
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-90 rounded-2xl bg-primary/10" />
            ))}
          </div>
        )}

        {/* Empty state */}
        <AnimatePresence>
          {!isLoading && filtered.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-28 text-center gap-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-full border border-primary/20 bg-white p-5">
                <PackageOpen size={28} className="text-primary" />
              </div>
              <p className="text-stone-500 text-sm">
                No dining packages found for{" "}
                <span className="text-stone-700 font-medium">&quot;{search}&quot;</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
                className="text-primary hover:text-secondary hover:bg-white"
              >
                Clear search
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Packages grid */}
        {!isLoading && filtered.length > 0 && (
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filtered.map((pkg) => (
                <motion.div
                  key={pkg._id}
                  variants={cardVariants}
                  layout
                  className="h-full"
                >
                  <Card
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full ${pkg.isPopular
                        ? "border-primary/30 bg-white shadow-primary/10 shadow-md"
                        : "border-stone-200 bg-white hover:border-primary/20 hover:shadow-stone-100"
                      }`}
                  >
                    {/* Popular top accent */}
                    {pkg.isPopular && (
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary/80 to-transparent" />
                    )}

                    {pkg.thumbnail && (
                      <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                        <img
                          src={getMediaUrl(pkg.thumbnail)}
                          alt={pkg.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <CardHeader className="px-5 pt-5 pb-3">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 min-h-5.5 mb-2">
                        {pkg.isPopular && (
                          <Badge className="gap-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 shadow-none">
                            <Star size={9} fill="currentColor" />
                            Popular
                          </Badge>
                        )}
                        {pkg.isFeatured && (
                          <Badge className="gap-1 bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/10 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 shadow-none">
                            <Zap size={9} fill="currentColor" />
                            Featured
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-normal text-stone-800 leading-snug">
                        {pkg.title}
                      </h3>

                      <div className="mt-2 flex items-baseline gap-0.5">
                        <span className="text-sm font-medium text-primary">৳</span>
                        <span className="font-sans text-3xl font-bold tracking-tight text-stone-800 leading-none">
                          {pkg.price.toLocaleString("en-BD")}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 px-5 pb-4">
                      <Separator className="bg-stone-100 mb-4" />
                      {pkg.description && (
                        <p className="mb-4 text-xs leading-5 text-stone-500">
                          {pkg.description}
                        </p>
                      )}
                      <ul className="space-y-2.5">
                        {pkg.services.map((service, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                              <Check size={9} strokeWidth={3} />
                            </span>
                            <span className="text-xs leading-snug text-stone-500">
                              {service}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="px-5 pb-5">
                      <Link
                        to={`/appointment?package=${pkg?.slug || pkg?._id}`}
                        className="w-full"
                      >
                        <Button
                          className={`w-full gap-2 text-xs font-semibold tracking-wide transition-all duration-200 rounded-xl ${pkg.isPopular
                              ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                              : "bg-transparent border border-stone-200 text-stone-500 hover:bg-white hover:border-primary/30 hover:text-secondary"
                            }`}
                        >
                          Reserve Table
                          <ArrowRight
                            size={13}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
