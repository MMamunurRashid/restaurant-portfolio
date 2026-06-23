import { useGetContactQuery } from "@/redux/features/contact/contactApi";
import { useAddMessageMutation } from "@/redux/features/contactMessage/contactMessageApi";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, Sparkles, User, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { ISocial } from "@/interface/contactInterface";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// React Icons
import {
    FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn,
    FaYoutube, FaWhatsapp, FaGithub, FaTiktok,
    FaPinterestP, FaSnapchatGhost, FaGlobe,
} from "react-icons/fa";
import { FieldInput } from "@/components/ui/inputField";
import { FieldTextarea } from "@/components/ui/textAreaField";

const iconMap: Record<string, React.ReactNode> = {
    facebook: <FaFacebookF size={14} />,
    instagram: <FaInstagram size={14} />,
    twitter: <FaTwitter size={14} />,
    linkedin: <FaLinkedinIn size={14} />,
    youtube: <FaYoutube size={14} />,
    whatsapp: <FaWhatsapp size={14} />,
    github: <FaGithub size={14} />,
    tiktok: <FaTiktok size={14} />,
    pinterest: <FaPinterestP size={14} />,
    snapchat: <FaSnapchatGhost size={14} />,
    default: <FaGlobe size={14} />,
};

export default function ContactCom() {
    const { data } = useGetContactQuery({});
    const contact = data?.data;
    const [addMessage, { isLoading: isSubmitting }] = useAddMessageMutation();

    const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
    const set = (key: string) => (val: string) => setForm((prev) => ({ ...prev, [key]: val }));

    const hasContactData = Boolean(
        contact && (
            contact.title ||
            contact.subTitle ||
            contact.email ||
            contact.phone ||
            contact.address ||
            contact.socials?.length ||
            contact.officeHours?.length
        )
    );
    const subTitle = contact?.subTitle || "";
    const { remainingTitle, highlightTitle } = useMemo(() => {
        const words = subTitle.split(" ");
        return {
            highlightTitle: words.slice(-2).join(" "),
            remainingTitle: words.slice(0, -2).join(" "),
        };
    }, [subTitle]);

    if (!hasContactData) return null;

    const displayPhone = contact?.phone?.split("|")?.[0]?.trim();
    const displayEmail = contact?.email?.split("|")?.[0]?.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.message) {
            toast.error("Please fill in the required fields.");
            return;
        }
        try {
            const res = await addMessage(form).unwrap();
            if (res?.success) {
                toast.success("Message sent successfully!");
                setForm({ name: "", phone: "", email: "", message: "" });
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong!");
        }
    };

    return (
        <section className="relative overflow-hidden bg-[#f7f8f4] py-14 md:px-4 md:py-24">
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">

                    {/* ── Left: Info ── */}
                    <motion.div
                        className="lg:col-span-5 flex flex-col gap-10"
                        initial={{ opacity: 0, x: -28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Header */}
                        <div>
                            {contact?.title && (
                                <div className="mb-5 inline-flex items-center gap-2 border border-[#1f4f46]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#1f4f46]">
                                    <Sparkles size={12} />
                                    {contact.title}
                                </div>
                            )}
                            {subTitle && (
                            <h2 className="font-serif text-4xl font-normal leading-[1.08] text-[#111827] md:text-6xl">
                                {remainingTitle}{" "}
                                <span className="italic text-[#1f4f46]">{highlightTitle}</span>
                            </h2>
                            )}
                        </div>

                        {/* Contact items */}
                        <div className="flex flex-col gap-5">
                            {displayPhone && <InfoItem icon={<Phone size={16} />} label="Reservations" value={displayPhone} link={`tel:${displayPhone}`} />}
                            {displayEmail && <InfoItem icon={<Mail size={16} />} label="Email" value={displayEmail} link={`mailto:${displayEmail}`} />}
                            {contact?.address && <InfoItem icon={<MapPin size={16} />} label="Location" value={contact.address} />}
                        </div>

                        <Separator className="bg-slate-200" />
                        {
                            contact?.officeHours?.length ? (
                                <>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-4">
                                            Opening Hours
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            {contact?.officeHours?.map((item: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between gap-4">
                                                    <span className="text-sm font-bold text-[#111827]">{item.day}</span>
                                                    <span
                                                        className={`text-sm font-medium tabular-nums transition-colors
                                                                ${item.hours === "Closed" || item.hours === "closed"
                                                                ? "text-red-600"
                                                                : "text-slate-600"
                                                            }`}
                                                    >
                                                        {item.hours}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Separator className="bg-slate-200" />
                                </>
                            ) : null
                        }

                        {/* Socials */}
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-4">
                                Follow the Table
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {contact?.socials?.map((social: ISocial, i: number) => (
                                    <motion.a
                                        key={i}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        whileHover={{ y: -3 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-9 h-9 border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-[#1f4f46] hover:border-[#1f4f46] hover:text-white shadow-sm transition-colors duration-200"
                                    >
                                        {iconMap[social.icon?.toLowerCase()] ?? iconMap.default}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Right: Form ── */}
                    <motion.div
                        className="lg:col-span-7"
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card className="rounded-lg border-slate-200 bg-white shadow-md shadow-slate-200/70 p-6 md:p-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
                                Reservation Notes
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                                    <FieldInput
                                        label="Full Name"
                                        placeholder="e.g. Fatema Akter"
                                        icon={<User size={16} />}
                                        value={form.name}
                                        onChange={set("name")}
                                        required
                                    />
                                    <FieldInput
                                        label="Phone Number"
                                        placeholder="+880 1X XX XXX XXX"
                                        icon={<Phone size={16} />}
                                        value={form.phone}
                                        onChange={set("phone")}
                                        required
                                    />
                                </div>

                                <FieldInput
                                    label="Email Address"
                                    placeholder="you@example.com"
                                    type="email"
                                    icon={<Mail size={16} />}
                                    value={form.email}
                                    onChange={set("email")}
                                />

                                <FieldTextarea
                                    label="How can we help?"
                                    placeholder="Tell us your preferred date, time, guest count, or event details."
                                    icon={<MessageSquare size={16} />}
                                    value={form.message}
                                    onChange={set("message")}
                                    rows={5}
                                    required
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full gap-2.5 bg-[#d75a3f] text-white hover:bg-[#c94830] shadow-sm shadow-slate-200 rounded-lg py-6 font-semibold tracking-wide text-sm transition-all duration-300 group disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            Send Reservation Request
                                            <Send size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ── InfoItem ──────────────────────────────────────────────

function InfoItem({ icon, label, value, link }: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    link?: string;
}) {
    const Wrapper = link ? "a" : "div";
    return (
        <Wrapper
        href={link}
        target={link?.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="group flex items-center gap-4 cursor-pointer"
    >
        <div className="w-10 h-10 shrink-0 border border-slate-200 bg-white flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-[#1f4f46] group-hover:border-[#1f4f46] group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-slate-700 group-hover:text-[#1f4f46] transition-colors duration-250">
                {value || "N/A"}
            </p>
        </div>
        </Wrapper>
    );
}
