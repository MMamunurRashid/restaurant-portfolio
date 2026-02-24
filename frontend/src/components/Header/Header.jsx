import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronDown, BiMenuAltRight } from "react-icons/bi";
import {
  FiHome,
  FiInfo,
  FiBriefcase,
  FiGift,
  FiCamera,
  FiMail,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useGetMainLogoQuery } from "../../Redux/logo/logoApi";
import { useGetCategoriesQuery } from "../../Redux/category/categoryApi";

export default function MainHeader() {
  const location = useLocation();
  const { data: logo } = useGetMainLogoQuery();
  const { data } = useGetCategoriesQuery();
  const services = data?.data;

  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileSidebar(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/", icon: <FiHome /> },
    { name: "About", path: "/about-us", icon: <FiInfo /> },
    { name: "FAQ", path: "/faq", icon: <FiCamera /> },
    { name: "Contact", path: "/contact-us", icon: <FiMail /> },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 py-2 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo*/}
            <Link to="/" className="group block">
              <img
                src={
                  !logo?.data[0]?.logo
                    ? "/images/logo/logo.png"
                    : `${import.meta.env.VITE_BACKEND_URL}/logo/${logo?.data[0]?.logo}`
                }
                alt="Logo"
                className={`transition-all duration-500 ${scrolled ? "w-12 sm:w-14" : "w-14 sm:w-16"} group-hover:scale-105`}
              />
            </Link>

            {/* --- Right Side --- */}
            <div className="flex items-center gap-2">
              <nav className="hidden xl:flex items-center">
                <ul className="flex items-center gap-1">
                  {navLinks.slice(0, 2).map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`px-4 py-2 text-[15px] font-semibold transition-all duration-300 rounded-full hover:text-secondary ${
                          location.pathname === link.path
                            ? "text-secondary bg-secondary/5"
                            : "text-gray-700"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}

                  {/* PC Services Dropdown */}
                  <li
                    className="relative group"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      to="/services"
                      className={`flex items-center gap-1 px-4 py-2 text-[15px] font-semibold transition-all duration-300 rounded-full group-hover:text-secondary ${
                        location.pathname.includes("/services")
                          ? "text-secondary bg-secondary/5"
                          : "text-gray-700"
                      }`}
                    >
                      Services{" "}
                      <BiChevronDown
                        className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </Link>
                    <div
                      className={`absolute top-full left-0 w-56 pt-4 transition-all duration-300 ${isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                    >
                      <ul className="bg-white shadow-2xl rounded-2xl p-2 border border-gray-50 overflow-hidden">
                        {services?.map((service) => (
                          <li key={service?._id}>
                            <Link
                              to={`/services/${service?.slug}`}
                              className="block px-4 py-2 text-[14px] text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors"
                            >
                              {service?.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>

                  {navLinks.slice(2).map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`px-4 py-2 text-[15px] font-semibold transition-all duration-300 rounded-full hover:text-secondary ${location.pathname === link.path ? "text-secondary bg-secondary/5" : "text-gray-700"}`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <button
                onClick={() => setMobileSidebar(true)}
                className="xl:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <BiMenuAltRight size={32} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Sidebar (Only active when mobileSidebar is true) --- */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${mobileSidebar ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setMobileSidebar(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 transform xl:hidden ${
          mobileSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b flex items-center justify-between bg-gray-50">
            <span className="font-bold text-lg text-primary italic">
              RA Beauty
            </span>
            <button
              onClick={() => setMobileSidebar(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${location.pathname === link.path ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    <span className="text-xl">{link.icon}</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
