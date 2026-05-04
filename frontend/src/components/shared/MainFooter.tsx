import { useGetContactQuery } from "@/redux/features/contact/contactApi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowUpRight, Sparkles } from "lucide-react";
import type { ISocial } from "@/interface/contactInterface";
import { useGetGeneralSettingQuery } from "@/redux/features/generalSetting/generalSettingApi";
import { CONFIG } from "@/config";
import { useMemo } from "react";
import FloatingActionButton from "./FloatingActionButton";
import { Separator } from "@/components/ui/separator";

// React Icons
import {
    FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn,
    FaYoutube, FaWhatsapp, FaGithub, FaTiktok,
    FaPinterestP, FaSnapchatGhost, FaGlobe,
} from "react-icons/fa";

const iconMap: Record<string, React.ReactNode> = {
    facebook:  <FaFacebookF size={13} />,
    instagram: <FaInstagram size={13} />,
    twitter:   <FaTwitter size={13} />,
    linkedin:  <FaLinkedinIn size={13} />,
    youtube:   <FaYoutube size={13} />,
    whatsapp:  <FaWhatsapp size={13} />,
    github:    <FaGithub size={13} />,
    tiktok:    <FaTiktok size={13} />,
    pinterest: <FaPinterestP size={13} />,
    snapchat:  <FaSnapchatGhost size={13} />,
    default:   <FaGlobe size={13} />,
};

const menus = [
    { name: "Home",         link: "/" },
    { name: "Our Services", link: "/services" },
    { name: "Our Packages", link: "/packages" },
    { name: "About Us",     link: "/about-us" },
    { name: "Gallery",      link: "/gallery" },
    { name: "Get in Touch", link: "/contact-us" },
    { name: "Latest Blogs", link: "/blogs" },
];

export default function MainFooter() {
    const currentYear = new Date().getFullYear();
    const { data } = useGetContactQuery({});
    const contact = data?.data || {};
    const { data: setting } = useGetGeneralSettingQuery({});
    const generalSetting = setting?.data || {};

    const displayPhone = useMemo(() => {
        if (!contact?.phone) return "";
        return contact.phone.split("|")[0].trim();
    }, [contact.phone]);

    return (
        <footer className="relative bg-stone-900 text-white overflow-hidden">
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#CC826C]/50 to-transparent" />

            {/* Background glows */}
            <div className="pointer-events-none absolute top-0 right-0 h-125 w-125 rounded-full bg-[#CC826C]/8 blur-[130px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-75 w-75 rounded-full bg-rose-900/10 blur-[100px]" />

            {/* ── CTA Banner ── */}
            <div className="relative z-10 border-b border-white/6">
                <div className="container py-20">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">

                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-xl"
                        >
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#CC826C]/30 bg-[#CC826C]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#CC826C]">
                                <Sparkles size={11} />
                                Book a Session
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl font-normal leading-[1.1] tracking-tight text-white">
                                Ready for Your <br />
                                <span className="italic text-[#CC826C]">Beauty Transformation?</span>
                            </h2>
                        </motion.div>

                        {/* Right: CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto"
                        >
                            <Link to="/appointment" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group flex w-full sm:w-auto items-center gap-2.5 rounded-2xl bg-[#CC826C] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#CC826C]/20 transition-colors hover:bg-[#b8705a]"
                                >
                                    Book Appointment
                                    <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </motion.button>
                            </Link>
                            <a
                                href={`mailto:${contact?.email}`}
                                className="flex w-full sm:w-auto items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:border-[#CC826C]/30 hover:bg-[#CC826C]/8 hover:text-white"
                            >
                                Send a Message
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="relative z-10 container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Link to="/">
                            <img
                                src={CONFIG.BASE_URL + generalSetting?.logo}
                                alt="Logo"
                                className="h-10 w-auto object-contain"
                                loading="lazy"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-white/40 italic max-w-52">
                            &ldquo;{generalSetting?.tagline || "Redefining beauty through professional care."}&rdquo;
                        </p>

                        {/* Socials */}
                        <div className="flex flex-wrap gap-2 mt-1">
                            {contact?.socials?.map((social: ISocial, i: number) => (
                                <motion.a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ y: -3 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-8 h-8 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center text-white/40 hover:bg-[#CC826C] hover:border-[#CC826C] hover:text-white transition-colors duration-200"
                                >
                                    {iconMap[social.icon?.toLowerCase()] ?? iconMap.default}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-6">
                            Explore
                        </p>
                        <ul className="space-y-3.5">
                            {menus.map((menu, i) => (
                                <li key={i}>
                                    <Link
                                        to={menu.link}
                                        className="group flex items-center gap-2 text-sm text-white/50 hover:text-[#CC826C] transition-colors duration-200"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-[#CC826C] transition-all duration-300 shrink-0" />
                                        {menu.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-6">
                            Contact
                        </p>
                        <div className="flex flex-col gap-5">
                            {displayPhone && (
                                <a href={`tel:${displayPhone}`} className="group flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-[#CC826C]/15 flex items-center justify-center text-[#CC826C] shrink-0 mt-0.5">
                                        <Phone size={13} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-0.5">Phone</p>
                                        <p className="text-sm text-white/60 group-hover:text-[#CC826C] transition-colors">{displayPhone}</p>
                                    </div>
                                </a>
                            )}
                            {contact?.email && (
                                <a href={`mailto:${contact.email}`} className="group flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-[#CC826C]/15 flex items-center justify-center text-[#CC826C] shrink-0 mt-0.5">
                                        <Mail size={13} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-0.5">Email</p>
                                        <p className="text-sm text-white/60 group-hover:text-[#CC826C] transition-colors break-all">{contact.email?.split("|")[0]}</p>
                                    </div>
                                </a>
                            )}
                            {contact?.address && (
                                <a href={contact?.googleMapLink} target="_blank" rel="noreferrer" className="group flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-[#CC826C]/15 flex items-center justify-center text-[#CC826C] shrink-0 mt-0.5">
                                        <MapPin size={13} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-0.5">Address</p>
                                        <p className="text-sm text-white/60 group-hover:text-[#CC826C] transition-colors leading-relaxed">{contact.address}</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-6">
                            Working Hours
                        </p>
                        <div className="flex flex-col gap-4">
                            { contact?.officeHours?.map((row: any) => (
                                <div key={row.day} className="flex flex-col gap-1">
                                    <p className="text-xs text-white/40">{row.day}</p>
                                    <p className={`text-sm font-semibold ${row.hours === "Closed" ? "text-[#dc1f52]" : "text-white/70"}`}>
                                        {row.hours}
                                    </p>
                                </div>
                            ))}

                            {/* Direct phone CTA */}
                            {displayPhone && (
                                <a
                                    href={`tel:${displayPhone}`}
                                    className="mt-2 inline-flex items-center gap-2 rounded-xl border border-[#CC826C]/25 bg-[#CC826C]/8 px-4 py-2.5 text-xs font-semibold text-[#CC826C] hover:bg-[#CC826C]/15 transition-colors"
                                >
                                    <Phone size={12} />
                                    {displayPhone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="relative z-10 border-t border-white/6">
                <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
                        © {currentYear} {generalSetting?.siteName || "Beauty Studio"}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy-policy" className="text-[10px] uppercase tracking-widest text-white/25 hover:text-[#CC826C] transition-colors">
                            Privacy Policy
                        </Link>
                        <Separator orientation="vertical" className="h-3 bg-white/10" />
                        <Link to="/terms-condition" className="text-[10px] uppercase tracking-widest text-white/25 hover:text-[#CC826C] transition-colors">
                            Terms
                        </Link>
                        <Separator orientation="vertical" className="h-3 bg-white/10" />
                        <span className="text-[10px] uppercase tracking-widest text-white/20">
                            Made with ♥
                        </span>
                    </div>
                </div>
            </div>

            <FloatingActionButton whatsappLink={contact?.whatsappLink} />
        </footer>
    );
}