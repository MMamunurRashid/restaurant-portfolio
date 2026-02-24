const reasons = [
  {
    id: 1,
    title: "Expert Stylists",
    description:
      "Our team consists of certified professionals with years of experience in luxury skin care and makeup.",
    icon: (
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
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Organic Products",
    description:
      "We use 100% skin-friendly, organic, and premium international brands to ensure zero side effects.",
    icon: (
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
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Hygienic Environment",
    description:
      "Your safety is our priority. We maintain strict hygiene protocols and sanitized equipment for every client.",
    icon: (
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
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Personalized Care",
    description:
      "We don't just provide service; we consult. Get beauty treatments tailored specifically for your skin type.",
    icon: (
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
          strokeWidth={1.5}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 bg-gray-50 overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h4 className="text-secondary font-bold tracking-[5px] uppercase text-sm">
              Why Choose Us
            </h4>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              A Special Treat for <br />
              <span className="text-secondary italic">Your Natural Beauty</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-lg leading-relaxed">
              Ra Beauty Canvas offers an unparalleled salon experience. We
              combine modern techniques with traditional care to give you the
              perfect glow.
            </p>

            {/* Simple Stats or Badge */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold text-xl">
                  10
                </div>
                <p className="font-bold text-gray-800 leading-tight italic">
                  Years of Professional <br /> Beauty Excellence
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Features Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <div
                key={reason.id}
                className="bg-white p-8 rounded-[35px] border border-gray-100 hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 mb-6 transform group-hover:-rotate-6">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
