import { CONFIG } from "@/config";
import { useGetCampaignQuery } from "@/redux/features/campaign/campaignApi";
import { Link } from "react-router-dom";

export default function CampaignBanner() {
  const { data, isLoading } = useGetCampaignQuery({});
  const campaign = data?.data;


  if (isLoading || !campaign) return null;


  return (
    <section className="py-10 container">
      <div className="relative overflow-hidden rounded-[40px] bg-[#1a1a1a]">
        {/* Background Decorative Circles */}
        <div className="absolute -top-12.5 -left-12.5 w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-12.5 -right-25 w-125 h-125 bg-pink-900/30 rounded-full blur-[120px]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 gap-6">
          {/* Left Side: Campaign Info */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-secondary/80 px-4 py-2 rounded-full border border-secondary/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-sm font-bold tracking-widest uppercase italic">
                {campaign?.subTitle}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-[1.1]">
              {campaign?.title}
            </h2>

            <p className="text-gray-400 text-lg max-w-md mx-auto lg:mx-0">
              {campaign?.description}
            </p>

            {/* Price & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
              <Link to="/appointment" className="bg-secondary hover:bg-white hover:text-secondary text-white px-10 py-4 rounded-2xl font-black transition-all duration-300 transform hover:-translate-y-2 shadow-2xl shadow-secondary/20 uppercase tracking-widest">
                Book Now
              </Link>
            </div>
          </div>

          {/* Right Side: Product/Visual */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            {/* Glossy Card behind product */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[30px] border border-white/10 -rotate-3 scale-90"></div>

            <div className="relative group">
              <img
                src={CONFIG.BASE_URL + campaign?.image}
                alt="campaign image"
                className="rounded-3xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 w-full max-w-sm object-cover h-100"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
