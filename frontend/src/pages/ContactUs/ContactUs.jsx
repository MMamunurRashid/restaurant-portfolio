import { useEffect, useState } from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaLocationDot,
} from "react-icons/fa6";
import Swal from "sweetalert2";
import { useAddContactMsgMutation } from "../../Redux/contactMsg/contactMsgApi";
import { useGetContactQuery } from "../../Redux/contact/contactApi";

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const { data } = useGetContactQuery();
  const contactUs = data?.data[0];
  const [addContactMsg, { isLoading }] = useAddContactMsgMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addContactMsg(formData).unwrap();
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "We will get back to you shortly.",
          confirmButtonColor: "#2f0020",
        });
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to send message. Please try again.", "error");
    }
  };

  const contactItems = [
    {
      icon: <FaPhone />,
      label: "Call Us",
      value: contactUs?.phone,
      color: "text-blue-500",
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      value: contactUs?.whatsapp,
      color: "text-green-500",
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: contactUs?.email,
      color: "text-red-400",
    },
    {
      icon: <FaLocationDot />,
      label: "Our Studio",
      value: contactUs?.address,
      color: "text-primary",
    },
  ];

  return (
    <section className="bg-gray-50 py-10">
      <div className="container">
        {/* Section Header */}
        <div className="mb-4 text-center">
          <h2 className="text-4xl font-bold text-neutral md:text-5xl italic">
            Get In Touch
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-secondary rounded-full"></div>
          <p className="mt-6 text-gray-500 max-w-xl mx-auto">
            Have a question about our bridal packages or services? Drop us a
            message or visit our studio.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`mt-1 text-xl ${item.color} bg-gray-50 p-3 rounded-2xl`}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{item.label}</h4>
                  <p className="text-gray-500 mt-1 leading-relaxed">
                    {item.value || "Not Available"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50">
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-secondary transition-all"
                  />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-secondary transition-all"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-secondary transition-all"
                />
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us about your requirements..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-secondary transition-all resize-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-max px-10 py-4 font-bold rounded-2xl bg-primary text-white border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[3rem] shadow-lg border-8 border-white">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.90244243014!2d90.3910801!3d23.7508672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzAzLjEiTiA5MMKwMjMnMjcuOSJF!5e0!3m2!1sen!2sbd!4v1614151234567!5m2!1sen!2sbd" // Example URL
            width="100%"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
