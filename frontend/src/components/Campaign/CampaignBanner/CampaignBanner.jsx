import { Link } from "react-router-dom";


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useGetCampaignBannersQuery } from "../../../Redux/campaignBanner/campaignBannerApi";

export default function CampaignBanner() {
  const { data, isLoading } = useGetCampaignBannersQuery();

  let content = null;
  if (isLoading) {
    content = (
      <>
        <div className="w-full h-36 sm:h-48 rounded bg-base-100 shadow"></div>{" "}
        <div className="w-full h-36 sm:h-48 rounded bg-base-100 shadow"></div>
      </>
    );
  }

  if (!isLoading && data?.data?.length > 0) {
    content = (
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          600: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
        }}
        className="w-full"
      >
        {data?.data?.map((banner) => (
          <SwiperSlide key={banner?._id}>
            <Link to={`/${banner?.link}`}>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/campaignBanner/${
                  banner?.image
                }`}
                alt="Campaign Banner"
                className="w-full h-36 sm:h-48 rounded"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <section className="pt-5">
      <div className="container">{content}</div>
    </section>
  );
}
