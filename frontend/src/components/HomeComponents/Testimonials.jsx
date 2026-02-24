import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Maria Rahman",
    role: "Bridal Client",
    comment:
      "Ra Beauty Canvas made my wedding day extra special. Their bridal makeup is just flawless and natural!",
    image:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    id: 2,
    name: "Farhana Akter",
    role: "Regular Member",
    comment:
      "The best skin care treatment in the city. I’ve been coming here for 2 years and my skin has never felt better.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Party Glow Client",
    comment:
      "Friendly staff and very professional service. Highly recommend their facial and hair spa treatments!",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    role: "Party Glow Client",
    comment:
      "Friendly staff and very professional service. Highly recommend their facial and hair spa treatments!",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
  {
    id: 5,
    name: "Nusrat Jahan",
    role: "Party Glow Client",
    comment:
      "Friendly staff and very professional service. Highly recommend their facial and hair spa treatments!",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-10 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h4 className="text-secondary font-bold tracking-[5px] uppercase text-sm mb-3">
            Testimonials
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            What Our <span className="text-secondary italic">Beauties Say</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Swiper Slider */}
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
          className="pb-10 testimonial-swiper"
        >
          {reviews.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 h-full flex flex-col justify-between group hover:border-secondary/30 transition-all duration-500">
                <div>
                  {/* Quote Icon */}
                  <div className="text-secondary/20 mb-4">
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
                  </div>

                  <p className="text-gray-700 italic text-lg leading-relaxed mb-8">
                    "{item.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-secondary p-0.5"
                  />
                  <div>
                    <h5 className="font-bold text-gray-900">{item.name}</h5>
                    <p className="text-xs text-secondary uppercase tracking-widest font-bold">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pagination Style Customization */}
      <style jsx global>{`
        .testimonial-swiper .swiper-pagination-bullet-active {
          background-color: var(--secondary) !important;
          width: 25px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}
