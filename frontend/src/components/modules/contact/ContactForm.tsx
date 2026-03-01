import type { TResponse } from "@/interface/globalInterface";
import { useAddMessageMutation } from "@/redux/features/contactMessage/contactMessageApi";
import { Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ContactForm() {
    const { register, handleSubmit, reset } = useForm();
    const [addMessage, { isLoading }] = useAddMessageMutation();

    const onSubmit = async (data: any) => {
        try {
            const res = await addMessage(data) as TResponse;
            if (res?.data?.success) {
                toast.success("Message sent successfully!");
                reset();
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) &&
                        res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""
                            }`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
                console.log(res);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong!");
            console.log(error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
            {/* Full Name */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Full Name</label>
                <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white border border-gray-100 px-6 py-4 text-sm focus:outline-none focus:border-black transition-all"
                />
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Email Address</label>
                <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white border border-gray-100 px-6 py-4 text-sm focus:outline-none focus:border-black transition-all"
                />
            </div>

            <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest">Phone Number</label>
                <input
                    {...register("phone", { required: true })}
                    type="text"
                    placeholder="123-456-7890"
                    className="w-full bg-white border border-gray-100 px-6 py-4 text-sm focus:outline-none focus:border-black transition-all"
                />
            </div>


            {/* Message */}
            <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest">Message</label>
                <textarea
                    {...register("message", { required: true })}
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full bg-white border border-gray-100 px-6 py-4 text-sm focus:outline-none focus:border-black transition-all resize-none"
                ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-primary text-white px-10 py-5 text-xs uppercase font-bold tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            Sending...
                            <Loader2 size={14} className="animate-spin" />
                        </>
                    ) : (
                        <>
                            Send Message
                            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}