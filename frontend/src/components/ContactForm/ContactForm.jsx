import { useState } from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Swal from "sweetalert2";
import { useAddContactMsgMutation } from "../../Redux/contactMsg/contactMsgApi";
import { useGetContactQuery } from "../../Redux/contact/contactApi";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { data } = useGetContactQuery();
  const contactUs = data?.data[0];
  const [addContactMsg, { isLoading }] = useAddContactMsgMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      return Swal.fire("", "Please fill the required fields", "warning");
    }

    const newMessage = { name, phone, email, message };

    try {
      const res = await addContactMsg(newMessage).unwrap();
      if (res?.success) {
        Swal.fire("", "Contact message sent successfully!", "success");
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      Swal.fire("", "Failed to send message", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-[40px] overflow-hidden flex flex-col md:flex-row border border-gray-100">
      {/* Left Side: Contact Info (Gray Background with Primary/Secondary Text) */}
      <div className="w-full md:w-2/5 bg-gray-100 p-6 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Soft decorative blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold italic leading-tight text-primary">
            Let’s Start <br />
            <span className="text-secondary">Your Glow Up</span>
          </h2>
          <p className="mt-4 text-gray-600 font-medium">
            Have questions about our services? Our experts are here to help you.
          </p>

          <div className="mt-10 space-y-6">
            {/* Phone */}
            <div className="flex items-center gap-5 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                <FaPhone className="text-xl" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-bold">
                  Call Us
                </p>
                <p className="font-bold text-gray-800">
                  {contactUs?.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-5 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <FaWhatsapp className="text-2xl" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-bold">
                  WhatsApp
                </p>
                <p className="font-bold text-gray-800">
                  {contactUs?.whatsapp || "N/A"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-5 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                <MdEmail className="text-2xl" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-bold">
                  Email Us
                </p>
                <p className="font-bold text-gray-800">
                  {contactUs?.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-5 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <FaLocationDot className="text-xl" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-bold">
                  Our Salon
                </p>
                <p className="font-bold text-gray-700 text-sm leading-snug">
                  {contactUs?.address || "Location Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form (White Background) */}
      <div className="w-full md:w-3/5 p-6 md:p-14 bg-white">
        <h3 className="text-2xl font-bold text-primary mb-8">Send a Message</h3>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Maria Khan"
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none focus:border-secondary focus:bg-white transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XX XXXXXX"
                className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none focus:border-secondary focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none focus:border-secondary focus:bg-white transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
              Message
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 outline-none focus:border-secondary focus:bg-white transition-all duration-300 resize-none"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              disabled={isLoading}
              className="w-full md:w-auto px-12 py-4 rounded-full bg-primary text-white font-bold tracking-widest uppercase shadow-xl shadow-primary/20 hover:bg-secondary transition-all duration-300 hover:-translate-y-1 disabled:bg-gray-400"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
