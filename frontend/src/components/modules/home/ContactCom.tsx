import { useGetContactQuery } from "@/redux/features/contact/contactApi";
import { useAddMessageMutation } from "@/redux/features/contactMessage/contactMessageApi";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageSquare, Github, Globe } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { ISocial } from "@/interface/contactInterface";
import { TikTokIcon } from "@/pages/admin/ContactUs";

const iconMap: Record<string, React.ReactNode> = {
    facebook: <Facebook size={20} />,
    instagram: <Instagram size={20} />,
    twitter: <Twitter size={20} />,
    linkedin: <Linkedin size={20} />,
    youtube: <Youtube size={20} />,
    whatsapp: <MessageSquare size={20} />,
    github: <Github size={20} />,
    tiktok: <TikTokIcon size={20} />,
    pinterest: <Globe size={20} />,
    snapchat: <Globe size={20} />,
    threads: <Globe size={20} />,
    default: <Globe size={20} />
};

type FormInput = {
    name: string;
    email: string;
    phone: string;
    message: string;
};

export default function ContactCom() {
    const { data } = useGetContactQuery({});
    const contact = data?.data || {};

    const [addMessage, { isLoading: isSubmitting }] = useAddMessageMutation();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>();

    // Stable Title Logic
    const subTitle = contact?.subTitle || "";
    const { remainingTitle, highlightTitle } = useMemo(() => {
        const titleWords = subTitle.split(" ");
        return {
            highlightTitle: titleWords.slice(-2).join(" "),
            remainingTitle: titleWords.slice(0, -2).join(" "),
        };
    }, [subTitle]);

    // Form Submit Handler
    const onSubmit = async (formData: FormInput) => {
        try {
            const res = await addMessage(formData).unwrap();
            if (res?.success) {
                toast.success("Message sent successfully!");
                reset();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong!");
        }
    };

    if (!contact) return null;

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            <div className="container px-4 mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">

                    {/* Left Side: Contact Info */}
                    <div className="lg:col-span-5 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary font-black text-[11px] uppercase tracking-[0.4em] mb-4 block">
                                {contact?.title || "Get In Touch"}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif italic leading-tight text-slate-900 mb-6">
                                {remainingTitle}{" "}
                                <span className="not-italic font-sans font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
                                    {highlightTitle}
                                </span>
                            </h2>
                        </motion.div>

                        <div className="space-y-8">
                            <InfoItem
                                icon={<Phone size={20} />}
                                label="Phone"
                                value={contact.phone?.split("|")[0]}
                                link={`tel:${contact.phone?.split("|")[0]}`}
                            />
                            <InfoItem
                                icon={<Mail size={20} />}
                                label="Email"
                                value={contact.email?.split("|")[0]}
                                link={`mailto:${contact.email?.split("|")[0]}`}
                            />
                            <InfoItem
                                icon={<MapPin size={20} />}
                                label="Location"
                                value={contact.address}
                                link={contact.googleMapLink}
                            />
                        </div>


                        {/* Social Links */}
                        <div className="pt-8 border-t border-gray-100">
                            <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] mb-6 text-gray-400">Follow Our Journey</h4>
                            <div className="flex gap-4">
                                {contact?.socials?.map((social: ISocial, i: number) => (
                                    <motion.a
                                        key={i}
                                        href={social?.url}
                                        target="_blank"
                                        className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                                    >
                                        {iconMap[social?.icon.toLowerCase()] || iconMap.default}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 bg-slate-50/50 p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">Full Name *</label>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full bg-white px-6 py-4 rounded-2xl border ${errors.name ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                    placeholder="Your Name"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] ml-4 italic">{errors.name.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">Phone Number *</label>
                                <input
                                    {...register("phone", { required: "Phone is required" })}
                                    className={`w-full bg-white px-6 py-4 rounded-2xl border ${errors.phone ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                    placeholder="+880 1234..."
                                />
                                {errors.phone && <p className="text-red-500 text-[10px] ml-4 italic">{errors.phone.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">Email Address</label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="w-full bg-white px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="jane@example.com"
                                />
                            </div>

                            {/* Message */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-4">How can we help? *</label>
                                <textarea
                                    {...register("message", { required: "Please write your message" })}
                                    rows={4}
                                    className={`w-full bg-white px-6 py-4 rounded-2xl border ${errors.message ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none`}
                                    placeholder="Write your message here..."
                                />
                                {errors.message && <p className="text-red-500 text-[10px] ml-4 italic">{errors.message.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full group bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function InfoItem({ icon, label, value, link }: any) {
    const Wrapper = link ? "a" : "div";
    return (
        <Wrapper href={link} target={link?.startsWith("http") ? "_blank" : undefined} className="flex gap-6 group cursor-pointer">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
                <p className="text-slate-800 font-bold group-hover:text-primary transition-colors">{value}</p>
            </div>
        </Wrapper>
    );
}