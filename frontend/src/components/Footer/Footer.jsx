import { AiFillInstagram } from "react-icons/ai";
import { BsFacebook, BsYoutube, BsArrowRightShort } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../Redux/category/categoryApi";
import { useGetContactQuery } from "../../Redux/contact/contactApi";
import { useGetMainLogoQuery } from "../../Redux/logo/logoApi";
import { useGetBusinessInfoQuery } from "../../Redux/businessInfoApi/businessInfoApi";

export default function Footer() {
  const { data, isLoading } = useGetCategoriesQuery();
  const { data: contact, isLoading: contactLoading } = useGetContactQuery();
  const { data: logo, isLoading: logoLoading } = useGetMainLogoQuery();
  const { data: business } = useGetBusinessInfoQuery();

  const businessInfo = business?.data[0];
  const contactData = contact?.data[0];
  const fiveCategories = data?.data.slice(0, 5);

  let yearNow = new Date().getFullYear();
  const startYear = businessInfo?.companyStartYear;

  if (isLoading || contactLoading || logoLoading) return null;

  return (
    <footer className="bg-[#111] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img
                src={
                  !logo?.data[0]?.logo
                    ? "/images/logo/logo.png"
                    : `${import.meta.env.VITE_BACKEND_URL}/logo/${logo?.data[0]?.logo}`
                }
                className="w-36"
                alt="Ra Beauty Canvas"
                loading="lazy"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {businessInfo?.bio ||
                "Enhancing your natural beauty with professional care and premium services."}
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={contactData?.facebookLink}
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              >
                <BsFacebook size={18} />
              </Link>
              <Link
                to={contactData?.instagramLink}
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"
              >
                <AiFillInstagram size={20} />
              </Link>
              <Link
                to={`https://wa.me/${contactData?.whatsapp}`}
                target="_blank"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                <IoLogoWhatsapp size={20} />
              </Link>
              <Link
                to="/"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <BsYoutube size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Popular Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Our Services
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-secondary"></span>
            </h3>
            <ul className="space-y-4">
              {fiveCategories?.map((category, i) => (
                <li key={i}>
                  <Link
                    to={`/services/${category?.slug}`}
                    className="text-gray-400 hover:text-secondary flex items-center gap-2 group transition-all"
                  >
                    <BsArrowRightShort
                      className="opacity-0 group-hover:opacity-100 transition-all"
                      size={20}
                    />
                    {category?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Quick Access
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-secondary"></span>
            </h3>
            <ul className="space-y-4">
              {[
                "About Us",
                "Our Brides",
                "Privacy Policy",
                "Terms & Conditions",
              ].map((link) => (
                <li key={link}>
                  <Link
                    to={
                      link === "About Us"
                        ? "/about-us"
                        : link === "Our Brides"
                          ? "/our-brides"
                          : "/"
                    }
                    className="text-gray-400 hover:text-secondary flex items-center gap-2 group transition-all"
                  >
                    <BsArrowRightShort
                      className="opacity-0 group-hover:opacity-100 transition-all"
                      size={20}
                    />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-secondary"></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Call Anytime
                  </p>
                  <p className="text-sm text-gray-300">{contactData?.phone}</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Email Us
                  </p>
                  <p className="text-sm text-gray-300">{contactData?.email}</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Our Location
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    {contactData?.address}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-[14px]">
            Copyright © {yearNow != startYear && startYear + " -"} {yearNow}{" "}
            <span className="text-secondary font-bold">
              {businessInfo?.companyName}
            </span>
            . All Rights Reserved.
          </p>
          <p className="text-gray-500 text-[14px]">
            Developed by{" "}
            <Link
              to="https://emanagerit.com"
              target="_blank"
              className="text-white hover:text-secondary font-semibold transition-all"
            >
              eManager
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
