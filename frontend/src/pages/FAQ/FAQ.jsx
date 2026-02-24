import { useState } from "react";
import { BiPlus, BiMinus } from "react-icons/bi";

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(0);

  const faqs = [
    {
      question: "How do I book a bridal makeover session?",
      answer:
        "Booking a bridal session is easy! You can book directly through our website's booking section, or call our studio. We recommend booking at least 2-3 months in advance for peak wedding seasons.",
    },
    {
      question: "What premium brands do you use for makeup?",
      answer:
        "We only use world-class premium brands like MAC, Huda Beauty, NARS, Dior, and Estée Lauder to ensure a flawless and long-lasting finish for your special day.",
    },
    {
      question: "Do you offer home services for group bookings?",
      answer:
        "Yes, we offer on-location services for bridal parties and group bookings of 5 or more people. Additional travel charges may apply based on the location.",
    },
    {
      question: "Can I get a consultation before my appointment?",
      answer:
        "Absolutely! We offer pre-service consultations where our experts analyze your skin/hair type and discuss the look you want to achieve.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Cancellations made 48 hours before the appointment will receive a full refund. For late cancellations, a small service fee might be deducted.",
    },
  ];

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-10">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary italic">
            Common <span className="text-secondary text-5xl">Questions</span>
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-primary rounded-full"></div>
          <p className="mt-6 text-gray-500 text-lg">
            Everything you need to know about our services and process.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl border transition-all duration-300 ${
                activeTab === index
                  ? "border-secondary shadow-xl shadow-secondary/5"
                  : "border-gray-100 shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleTab(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
              >
                <span
                  className={`text-lg md:text-xl font-bold transition-colors ${
                    activeTab === index ? "text-primary" : "text-gray-800"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeTab === index
                      ? "bg-primary text-white rotate-180"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {activeTab === index ? (
                    <BiMinus size={20} />
                  ) : (
                    <BiPlus size={20} />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  activeTab === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 md:px-8 pb-8 text-gray-500 leading-relaxed border-t border-gray-50 mt-2 pt-4 text-base md:text-lg">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions? */}
        <div className="mt-10 bg-primary rounded-[2.5rem] p-8 md:p-12 text-center text-white shadow-2xl shadow-primary/30">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 italic text-white">
            Still Have Questions?
          </h3>
          <p className="text-white/80 mb-8 max-w-lg mx-auto text-lg">
            If you couldn't find your answer, feel free to contact our support
            team anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-secondary text-white rounded-full font-bold hover:bg-white hover:text-primary transition-all shadow-lg">
              Contact Support
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
