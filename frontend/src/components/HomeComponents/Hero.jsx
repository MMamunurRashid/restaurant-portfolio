import { A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { useRef } from "react";
import { useGetBannersQuery } from "../../Redux/banner/bannerApi";

export default function Hero() {
  const { data } = useGetBannersQuery();
  const banners = data?.data;
  const swiperRef = useRef(null);

  return (
    <section>
      <Swiper
        modules={[A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {banners?.map((banner) => (
          <SwiperSlide key={banner._id}>
            <img
              className="zoom-out h-[40vh] md:h-[60vh] lg:h-[80vh] w-full object-cover"
              src={`${import.meta.env.VITE_BACKEND_URL}/banner/${banner.image}`}
              alt="Banner_Image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
