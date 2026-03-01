import { useGetContactQuery } from "@/redux/features/contact/contactApi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Facebook, Instagram, Twitter, Linkedin, Youtube,
    MessageSquare, Github, Globe, Mail, MapPin
} from 'lucide-react';
import { TikTokIcon } from "@/pages/admin/ContactUs";
import type { ISocial } from "@/interface/contactInterface";
import { useGetGeneralSettingQuery } from "@/redux/features/generalSetting/generalSettingApi";
import { CONFIG } from "@/config";
import { useMemo } from "react";
import FloatingActionButton from "./FloatingActionButton";

const iconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={16} />,
    instagram: <Instagram size={16} />,
    twitter: <Twitter size={16} />,
    linkedin: <Linkedin size={16} />,
    youtube: <Youtube size={16} />,
    whatsapp: <MessageSquare size={16} />,
    github: <Github size={16} />,
    tiktok: <TikTokIcon size={16} />,
    default: <Globe size={16} />
};

const menus = [
    { name: "Home", link: "/" },
    { name: "Our Services", link: "/services" },
    { name: "About Story", link: "/about-us" },
    { name: "Get in Touch", link: "/contact-us" },
    { name: "Latest News", link: "/blogs" }
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
        <footer className="relative bg-[#0A0A0A] text-white pt-20 pb-12 overflow-hidden border-t border-white/5">
            <div className="container relative z-10">
                {/* 1. Top Section: Big CTA */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.60] uppercase mb-8">
                            Ready for <br />
                            <span className="text-transparent border-text italic font-serif lowercase px-2">your</span> <br />
                            Evolution?
                        </h2>
                        <div className="flex flex-wrap gap-4 mt-10">
                            <Link to="/appointment" className="px-10 py-5 bg-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all">
                                Book Session
                            </Link>
                            <a href={`mailto:${contact?.email}`} className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                                Send Message
                            </a>
                        </div>
                    </motion.div>

                    <div className="flex flex-col items-start lg:items-end">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary mb-4">Direct Connection</p>
                        <a href={`tel:${displayPhone}`} className="text-3xl md:text-5xl font-light tracking-tighter">
                            {displayPhone}
                        </a>
                    </div>
                </div>

                {/* 2. Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-24 border-b border-white/5">

                    {/* Brand Info */}
                    <div className="space-y-8">
                        <img
                            src={CONFIG.BASE_URL + generalSetting?.logo}
                            alt="Logo"
                            className="w-24"
                            loading="lazy"
                        />
                        <p className="text-white/40 text-sm leading-relaxed max-w-62.5 italic">
                            "{generalSetting?.tagline || "Redefining beauty standards through professional care."}"
                        </p>
                        <div className="flex gap-3">
                            {contact?.socials?.map((social: ISocial, i: number) => (
                                <a
                                    key={i}
                                    href={social?.url}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary transition-all duration-300"
                                >
                                    {iconMap[social?.icon.toLowerCase()] || iconMap.default}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="lg:pl-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Explore</h4>
                        <ul className="space-y-4">
                            {menus.map((menu, i) => (
                                <li key={i}>
                                    <Link to={menu.link} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-secondary transition-colors">
                                        {menu.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Locate Us</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <MapPin size={18} className="text-secondary shrink-0" />
                                <p className="text-xs text-white/90 leading-relaxed uppercase tracking-wider">
                                    {contact?.address}
                                </p>
                            </div>
                            <div className="flex gap-4 italic font-serif">
                                <Mail size={18} className="text-secondary shrink-0" />
                                <p className="text-sm text-white/80">{contact?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Bar */}
                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em]">
                        © {currentYear} {generalSetting?.siteName}. All Rights Reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link to="/privacy-policy" className="text-[9px] uppercase font-black tracking-widest hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms-condition" className="text-[9px] uppercase font-black tracking-widest hover:text-white transition-colors">Terms</Link>
                        <span className="text-[9px] font-black tracking-[0.3em]">Built with Excellence</span>
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />



            <FloatingActionButton whatsappLink={contact?.whatsappLink} />
        </footer>
    );
}