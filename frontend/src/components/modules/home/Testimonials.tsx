import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { useGetAllTestimonialQuery } from "@/redux/features/testimonial/testimonialApi";
import type { ITestimonial } from "@/interface/testimonialInterface";
import { Quote, Star } from "lucide-react";
import { getMediaUrl } from "@/utils/media";

export default function Testimonials() {
  const { data } = useGetAllTestimonialQuery({ limit: 10 });
  const testimonials: ITestimonial[] = (data?.data || []).filter(
    (item: ITestimonial) => item?.review || item?.name
  );

  if (!testimonials.length) return null;

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: ("easeOut" as any) },
    },
  };

  return (
    <section className="relative overflow-hidden bg-white py-14 md:px-4 md:py-24">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Star size={13} fill="currentColor" />
            Guest Notes
          </div>
          <h2 className="font-serif text-4xl font-normal leading-tight text-neutral md:text-6xl">
            What guests say after the last course
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600">
            Real dining impressions from coffee regulars, dinner guests, and private table hosts.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Swiper
            modules={[A11y, Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            loop={testimonials.length > 2}
            autoplay={{ delay: 4200, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12 testimonial-swiper"
          >
            {testimonials.map((item: ITestimonial, index: number) => (
              <SwiperSlide key={item?._id || index}>
                <motion.article
                  variants={cardVariant}
                  className="flex h-full min-h-[320px] flex-col justify-between rounded-lg border border-slate-200 bg-muted p-7 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center bg-white text-primary shadow-sm">
                      <Quote size={19} />
                    </div>

                    {item?.review && (
                      <p className="text-base leading-8 text-slate-700">
                        &ldquo;{item.review}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex items-center gap-4 border-t border-slate-200 pt-5">
                    {item?.image && (
                      <img
                        src={getMediaUrl(item.image)}
                        alt={item?.name}
                        className="h-12 w-12 rounded-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <h5 className="font-bold text-neutral">{item.name}</h5>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                        {item?.designation}
                      </p>
                    </div>
                  </div>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
