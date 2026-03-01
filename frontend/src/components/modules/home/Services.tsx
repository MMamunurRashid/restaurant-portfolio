import ServicesCard from "./ServicesCard";

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
        <ServicesCard />
      </div>
    </section>
  );
}
