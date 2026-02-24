import { Link } from "react-router-dom";
import { useGetTopCampaignBannersQuery } from "../../../Redux/topCampaignBanner";

export default function TopCampaignBanner() {
  const { data, isLoading } = useGetTopCampaignBannersQuery();

  if (isLoading) {
    return (
      <div className="w-full h-28 sm:h-40 lg:h-60 bg-gray-100 rounded"></div>
    );
  }

  return (
    <section className="">
      <div className="">
        <div className="w-full">
          <div className="w-full max-h-[50vh] relative">
            <Link to="/shops">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/banner/${
                  data?.data[0]?.image
                }`}
                alt=""
                className="w-full max-h-[50vh] object-cover rounded"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
