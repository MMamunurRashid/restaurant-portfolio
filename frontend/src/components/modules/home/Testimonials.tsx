import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { useGetAllTestimonialQuery } from "@/redux/features/testimonial/testimonialApi";
import type { ITestimonial } from "@/interface/testimonialInterface";
import { CONFIG } from "@/config";

export default function Testimonials() {
  const { data, isLoading } = useGetAllTestimonialQuery({ limit: 10 });
  const testimonials = data?.data || [];

  if (isLoading || !testimonials?.length) return null;

  // Animation Variants
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h4 className="text-secondary font-bold tracking-[5px] uppercase text-sm mb-3">
            Testimonials
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            What Our <span className="text-secondary italic">Beauties Say</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Swiper Slider */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Swiper
            modules={[A11y, Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12 testimonial-swiper"
          >
            {testimonials.map((item: ITestimonial, index: number) => (
              <SwiperSlide key={item?._id || index}>
                <motion.div
                  variants={cardVariant}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                  }}
                  className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 h-full flex flex-col justify-between group hover:border-secondary/30 transition-all duration-500"
                >
                  <div>
                    {/* Quote Icon */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-secondary/20 mb-4"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="40"
                        width="40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h16V32h-16c-88.4 0-160 71.6-160 160v240h240V256zm-256 0h-80v-64c0-35.3 28.7-64 64-64h16V32h-16C103.6 32 32 103.6 32 192v240h240V256z"></path>
                      </svg>
                    </motion.div>

                    <p className="text-gray-700 italic text-lg leading-relaxed mb-8">
                      "{item?.review}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                    <img
                      src={CONFIG.BASE_URL + item?.image}
                      alt={item?.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-secondary p-0.5"
                      loading="lazy"
                      onError={(e: any) => (e.target.src = 'https://ui-avatars.com/api/?name=' + item?.name)}
                    />
                    <div>
                      <h5 className="font-bold text-gray-900">{item.name}</h5>
                      <p className="text-xs text-secondary uppercase tracking-widest font-bold">
                        {item?.designation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}