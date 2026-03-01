import { AiOutlineClose } from "react-icons/ai";
import { CgMenuRight } from "react-icons/cg";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useGetGeneralSettingQuery } from "@/redux/features/generalSetting/generalSettingApi";
import { CONFIG } from "@/config";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Blogs", href: "/blogs" },
];

export default function Header({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen: boolean; setMobileMenuOpen: (open: boolean) => void; }) {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const isHomePage = location.pathname === "/";
    const isServicePage = location.pathname.startsWith("/service");

    const { data } = useGetGeneralSettingQuery({});
    const logo = data?.data?.logo;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(isHomePage || isServicePage ? window.scrollY > 50 : true);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHomePage, isServicePage]);


    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [mobileMenuOpen]);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/60 text-neutral shadow-lg backdrop-blur-md py-2" : "bg-transparent py-6 text-white"}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
        >
            <div className="container flex items-center justify-between">
                <Link to="/" className="relative z-10">
                    <img src={CONFIG.BASE_URL + logo || "/images/logo.png"} alt="Logo" className={`${scrolled ? "w-18" : "w-20"} transition-all hover:scale-105`} loading="lazy" />
                </Link>

                <nav className="hidden lg:flex items-center gap-7">
                    {navLinks.map((link, index) => (
                        <div key={index} className="relative group py-2">
                            <Link to={link.href} className="hover:text-secondary font-bold transition-all flex items-center gap-1 uppercase text-xs tracking-[0.15em]">
                                {link.name}
                            </Link>
                        </div>
                    ))}
                </nav>

                <div className="hidden lg:block">
                    <Link
                        to="/appointment"
                        className="group relative overflow-hidden bg-primary text-white hover:text-primary px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm transition-all duration-500 ease-in-out flex items-center gap-3 shadow-[0_10px_20px_rgba(229,35,41,0.3)] hover:shadow-[0_15px_30px_rgba(229,35,41,0.5)] hover:-translate-y-1"
                    >
                        {/* Shimmer Effect Overlay */}
                        <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                        {/* Button Text */}
                        <span className="relative z-10">Appointment</span>

                        {/* Animated Icon */}
                        <div className="relative z-10 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="w-4 h-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>

                        {/* Hover Background Layer */}
                        <span className="absolute inset-0 bg-white translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
                    </Link>
                </div>

                <button
                    className={`lg:hidden p-2 rounded-full transition-colors ${scrolled ? "text-neutral-900 bg-neutral-100" : "text-white bg-white/10"}`}
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <CgMenuRight size={26} />
                </button>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Background Overlay - Deep Dark */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-55"
                        />

                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            data-lenis-prevent
                            className="fixed right-0 top-0 w-[95%] max-w-100 z-60 flex flex-col h-screen overflow-hidden border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
                            /* Dark Glossy Style */
                            style={{
                                background: "linear-gradient(160deg, rgba(20, 20, 20, 0.95) 0%, rgba(5, 5, 5, 0.85) 100%)",
                                backdropFilter: "blur(20px) saturate(150%)",
                                WebkitBackdropFilter: "blur(20px) saturate(150%)",
                            }}
                        >
                            {/* Header - Subtle Dark Polish */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 shrink-0 bg-black/20">
                                <img src={CONFIG.BASE_URL + logo} alt="Logo" className="w-36 brightness-0 invert" />
                                {/* Logo white na hole 'invert' use korlam jate dark-e phute uthe */}
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-8 overscroll-contain">
                                <div className="flex flex-col gap-6">
                                    {navLinks.map((link, i) => (
                                        <div key={i} className="flex flex-col border-b border-white/5 pb-4 last:border-0">
                                            <div className="flex items-center justify-between group">
                                                <Link
                                                    to={link.href}
                                                    className={`text-lg font-black uppercase tracking-tighter transition-all ${location.pathname === link.href ? "text-primary translate-x-1" : "text-white/80 group-hover:text-primary group-hover:translate-x-1"}`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Appointment Button */}
                            <div className="p-8 bg-black/40 border-t border-white/5">
                                <Link
                                    to="/appointment"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full bg-primary text-white py-5 text-sm font-black uppercase tracking-[0.2em] rounded-xl text-center shadow-[0_10px_30px_rgba(229,35,41,0.2)] hover:shadow-primary/40 transition-all active:scale-95"
                                >
                                    Book Appointment
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    );
}