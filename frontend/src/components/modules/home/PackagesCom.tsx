"use client";

import { Check, Sparkles, ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import type { IPackage } from "@/interface/packageInterface";
import { useGetAllPackageQuery } from "@/redux/features/packages/packagesApi";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function FeaturedPackages() {
  const { data, isLoading } = useGetAllPackageQuery({ isFeatured: true });
  const packages: IPackage[] = data?.data || [];

  return (
    <section className="relative py-24 px-4 bg-rose-50/40 overflow-hidden">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-125 w-125 rounded-full bg-rose-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-100 w-100 rounded-full bg-amber-200/25 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/60 bg-rose-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-500">
            <Sparkles size={12} />
            Our Packages
          </div>
          <h2 className="font-serif text-5xl font-normal leading-tight tracking-tight text-stone-800 md:text-6xl">
            Choose Your{" "}
            <span className="italic text-rose-500">Perfect Plan</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-stone-500">
            Tailored beauty experiences crafted just for you. Every package
            includes our signature care and premium products.
          </p>
        </motion.div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl bg-rose-100/60" />
            ))}
          </div>
        )}

        {/* Cards */}
        {!isLoading && (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {packages.map((pkg) => (
              <motion.div key={pkg._id} variants={cardVariants} className="h-full">
                <Card
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl h-full ${
                    pkg.isPopular
                      ? "border-rose-200 bg-white shadow-rose-100 shadow-md"
                      : "border-stone-200 bg-white hover:border-rose-200 hover:shadow-md"
                  }`}
                >
                  {/* Popular top line */}
                  {pkg.isPopular && (
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-rose-400 to-transparent" />
                  )}

                  <CardHeader className="pb-4 pt-6 px-6">
                    <div className="mb-3 flex items-center gap-2 min-h-6">
                      {pkg.isPopular && (
                        <Badge className="gap-1 bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wide shadow-none">
                          <Star size={10} fill="currentColor" />
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-normal text-stone-800">
                      {pkg.title}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-base font-medium text-rose-400">৳</span>
                      <span className="font-sans text-4xl font-bold tracking-tight text-stone-800">
                        {pkg.price.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 px-6 pb-6">
                    <div className="h-px w-full bg-stone-100 mb-5" />
                    <ul className="space-y-3">
                      {pkg.services.map((service, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-400">
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span className="text-sm leading-snug text-stone-500">
                            {service}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="px-6 pb-6">
                    <Link
                      to={`/appointment?package=${pkg.slug || pkg._id}`}
                      className="w-full"
                    >
                      <Button
                        className={`w-full gap-2 font-semibold tracking-wide transition-all duration-200 rounded-xl ${
                          pkg.isPopular
                            ? "bg-rose-500 text-white hover:bg-rose-600 shadow-sm shadow-rose-200"
                            : "bg-transparent border border-stone-200 text-stone-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500"
                        }`}
                      >
                        Book Now
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View all */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/packages">
            <Button
              variant="ghost"
              className="gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 font-medium tracking-wide"
            >
              View all packages
              <ArrowRight size={15} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}