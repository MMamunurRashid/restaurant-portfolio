import { AiOutlineClose } from "react-icons/ai";
import { CgMenuRight } from "react-icons/cg";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useGetGeneralSettingQuery } from "@/redux/features/generalSetting/generalSettingApi";
import { ArrowRight, Calendar } from "lucide-react";
import { getMediaUrl } from "@/utils/media";

const navLinks = [
    { name: "Home",       href: "/" },
    { name: "Menu",       href: "/services" },
    { name: "Dining Sets", href: "/packages" },
    { name: "About",      href: "/about-us" },
    { name: "Gallery",    href: "/gallery" },
    { name: "Journal",    href: "/blogs" },
    { name: "Contact",    href: "/contact-us" },
];

export default function Header({
    mobileMenuOpen,
    setMobileMenuOpen,
}: {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}) {
    const location = useLocation();

    const { data } = useGetGeneralSettingQuery({});
    const generalSetting = data?.data || {};
    const logoSrc = generalSetting?.logo ? getMediaUrl(generalSetting.logo) : "";

    // Removed scroll effect: header uses static (scrolled) styles now.

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    }, [mobileMenuOpen]);

    const isActive = (href: string) =>
        href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

    return (
        <motion.header
            className={`fixed top-3 left-3 right-3 z-50 rounded-3xl transition-all duration-500 bg-white/90 backdrop-blur-md shadow-xl  py-3`}
        >
            <div className="container mx-auto px-3 flex items-center justify-between gap-8">

                {/* Logo */}
                {(logoSrc || generalSetting?.siteName) && (
                    <Link to="/" className="relative z-10 shrink-0">
                        {logoSrc ? (
                            <img
                                src={logoSrc}
                                alt={generalSetting?.siteName || "Logo"}
                                className={`object-contain transition-all duration-300 hover:opacity-80 h-16`}
                                loading="lazy"
                            />
                        ) : (
                            <span className="font-serif text-2xl text-neutral">{generalSetting.siteName}</span>
                        )}
                    </Link>
                )}

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 rounded-xl group ${
                                    active ? "text-secondary" : "text-slate-500 hover:text-secondary"
                                }`}
                            >
                                {/* Active dot */}
                                {active && (
                                    <motion.span
                                        layoutId="nav-active"
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 rounded-2xl h-1 bg-primary"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden lg:block shrink-0">
                    <Link to="/appointment">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`group flex items-center gap-2 rounded-lg px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 bg-primary text-white shadow-md shadow-slate-200 hover:bg-primary/90`}
                        >
                            <Calendar size={13} />
                            Reserve
                            <ArrowRight
                                size={13}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </motion.button>
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className={`lg:hidden p-2 rounded-lg transition-colors text-slate-700 bg-slate-100 hover:bg-slate-200`}
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <CgMenuRight size={24} />
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            data-lenis-prevent
                            className="fixed right-0 top-0 z-50 flex h-screen w-[88%] max-w-sm flex-col bg-white shadow-2xl shadow-slate-300/40"
                        >
                            {/* Top accent line */}
                            <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary/60 to-transparent" />

                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
                                {(logoSrc || generalSetting?.siteName) && (
                                    logoSrc ? (
                                        <img
                                            src={logoSrc}
                                            alt={generalSetting?.siteName || "Logo"}
                                            className="h-8 object-contain"
                                        />
                                    ) : (
                                        <span className="font-serif text-xl text-neutral">{generalSetting.siteName}</span>
                                    )
                                )}
                                <button
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-secondary hover:text-white transition-all duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <AiOutlineClose size={18} />
                                </button>
                            </div>

                            {/* Nav links */}
                            <div className="flex-1 overflow-y-auto px-7 py-6">
                                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-300 mb-5">
                                    Navigation
                                </p>
                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link, i) => {
                                        const active = isActive(link.href);
                                        return (
                                            <motion.div
                                                key={link.href}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                <Link
                                                    to={link.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center justify-between px-4 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                                        active
                                                            ? "bg-secondary/10 text-secondary border border-secondary/20"
                                                            : "text-slate-600 hover:bg-slate-50 hover:text-secondary"
                                                    }`}
                                                >
                                                    {link.name}
                                                    <ArrowRight
                                                        size={14}
                                                        className={`transition-transform ${active ? "text-secondary translate-x-0.5" : "text-slate-300"}`}
                                                    />
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Bottom CTA */}
                            <div className="px-7 py-6 border-t border-slate-100 bg-slate-50/70">
                                <Link
                                    to="/appointment"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full flex items-center justify-center gap-2.5 bg-primary text-white py-4 rounded-lg text-sm font-semibold tracking-wide shadow-md shadow-slate-200 hover:bg-primary/90 transition-colors"
                                    >
                                        <Calendar size={15} />
                                        Reserve a Table
                                    </motion.button>
                                </Link>
                                <p className="text-center text-[10px] text-slate-400 mt-3 tracking-wide">
                                    We will confirm your table shortly
                                </p>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
