import React from "react";

const services = [
  {
    id: 1,
    title: "Skin Care & Facial",
    description:
      "Experience deep cleansing and rejuvenation with our organic gold facials.",
    icon: "✨",
    image:
      "https://images.unsplash.com/photo-1570172619665-22879590858e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "Bridal Makeup",
    description:
      "Make your special day more beautiful with our professional bridal makeup artists.",
    icon: "💄",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "Hair Styling",
    description:
      "Get the perfect cut, color, and spa treatment for your precious hair.",
    icon: "✂️",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    title: "Nail Art & Spa",
    description:
      "Treat your hands and feet with our premium manicure and pedicure services.",
    icon: "💅",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc566371?auto=format&fit=crop&q=80&w=400",
  },
];

export default function Services() {
  return (
    <section className="py-10">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h4 className="text-primary font-bold tracking-[4px] uppercase text-sm mb-3">
            Our Expertise
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Exclusive{" "}
            <span className="text-secondary italic">Beauty Services</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-pink-100 flex flex-col items-center text-center p-2"
            >
              {/* Service Image */}
              <div className="relative w-full h-64 overflow-hidden rounded-2xl">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-full text-2xl shadow-md">
                  {service.icon}
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <button className="text-primary font-bold text-xs uppercase tracking-widest border-b-2 border-pink-200 group-hover:border-primary transition-all pb-1">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button className="bg-primary/90 hover:bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-pink-200 transition-all hover:-translate-y-1">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}
