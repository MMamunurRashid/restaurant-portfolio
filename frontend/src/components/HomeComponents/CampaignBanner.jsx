export default function CampaignBanner() {
  return (
    <section className="py-10 container">
      <div className="relative overflow-hidden rounded-[40px] bg-[#1a1a1a]">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-50px] left-[-50px] w-80 h-80 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-50px] right-[-100px] w-[500px] h-[500px] bg-pink-900/30 rounded-full blur-[120px]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 md:p-16 gap-12">
          {/* Left Side: Campaign Info */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-secondary/80 px-4 py-2 rounded-full border border-secondary/50">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-sm font-bold tracking-widest uppercase italic">
                Limited Time Offer
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-[1.1]">
              Get <span className="text-secondary/90">40% OFF</span> on <br />
              Bridal Glowing Kit
            </h2>

            <p className="text-gray-400 text-lg max-w-md mx-auto lg:mx-0">
              Unlock your natural radiance with our premium organic skin care
              products. The ultimate treatment for your special day.
            </p>

            {/* Price & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
              <button className="bg-secondary hover:bg-white hover:text-secondary text-white px-10 py-4 rounded-2xl font-black transition-all duration-300 transform hover:-translate-y-2 shadow-2xl shadow-secondary/20 uppercase tracking-widest">
                Book Now
              </button>
            </div>
          </div>

          {/* Right Side: Product/Visual */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            {/* Glossy Card behind product */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[30px] border border-white/10 -rotate-3 scale-90"></div>

            <div className="relative group">
              <img
                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600"
                alt="Product Kit"
                className="rounded-3xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 w-full max-w-sm object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
