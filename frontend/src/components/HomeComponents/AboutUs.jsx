import { useState } from "react";

export default function AboutUs() {
  const [isOpen, setIsOpen] = useState(false);
  const videoId = "YOUR_YOUTUBE_VIDEO_ID";

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <section className="py-16 bg-[#fff5f7ba] overflow-hidden relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800"
                alt="Beauty Salon Interior"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-6 z-20 bg-primary p-8 rounded-2xl shadow-xl text-white hidden md:block text-center">
              <div className="text-4xl font-bold mb-1">10+</div>
              <div className="text-sm uppercase tracking-widest font-medium text-pink-100">
                Years of <br /> Excellence
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-primary font-bold tracking-[4px] uppercase text-sm">
                About Ra Beauty Canvas
              </h4>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Where Beauty Meets <br />
                <span className="text-primary italic">Excellence & Care</span>
              </h2>
            </div>

            <p className="text-gray-600 text-lg">
              At Ra Beauty Canvas, we believe that beauty is more than just skin
              deep. Our mission is to provide a sanctuary where you can escape
              the daily hustle.
            </p>

            {/* Video Trigger Button */}
            <div className="pt-6">
              <button
                onClick={toggleModal}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-25"></div>
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center group-hover:bg-secondary transition-all shadow-lg relative z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <span className="font-bold text-neutral tracking-widest uppercase group-hover:text-primary transition-colors">
                  Watch Our Story
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- VIDEO MODAL --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop Blur/Overlay */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={toggleModal}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl z-10 animate-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute -top-12 right-0 text-white flex items-center gap-2 hover:text-pink-400 transition-colors"
            >
              <span className="font-bold text-sm uppercase tracking-widest">
                Close
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* YouTube Iframe */}
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
