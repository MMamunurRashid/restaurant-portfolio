import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Edit3, Save, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import parser from "html-react-parser";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAddPrivacyPolicyMutation, useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from "@/redux/features/privacyPolicy/privacyPolicyApi";
import JoditEditor from 'jodit-react';
import { JODIT_CONFIG } from "@/config/joditConfig";
import type { TResponse } from "@/interface/globalInterface";
import type { IPrivacyPolicy } from "@/interface/privacyPolicyInterface";

export default function PrivacyPolicy() {
    const editor = useRef(null);
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, reset, control } = useForm<IPrivacyPolicy>();

    const { data } = useGetPrivacyPolicyQuery({});
    const policyData = useMemo(() => data?.data, [data]);
    const id = policyData?._id;


    useEffect(() => {
        if (policyData) {
            reset(policyData);
        }
    }, [policyData, reset]);

    const [addPrivacyPolicy, { isLoading }] = useAddPrivacyPolicyMutation();
    const [updatePrivacyPolicy, { isLoading: uLoading }] = useUpdatePrivacyPolicyMutation();

    const onSubmit = async (data: IPrivacyPolicy) => {
        if (id) {
            const res = (await updatePrivacyPolicy({ id, data: data })) as TResponse;
            if (res?.data?.success) {
                toast.success("Privacy Policy Update Success");
                setIsEditing(false);
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
        } else {
            const res = (await addPrivacyPolicy(data)) as TResponse;
            if (res?.data?.success) {
                toast.success("Privacy Policy Add Success");
                setIsEditing(false);
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
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="flex flex-wrap gap-2 justify-between items-center mb-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <ShieldCheck className="text-primary" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Privacy Policy</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Management Panel</p>
                    </div>
                </div>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-gray-200"
                    >
                        <Edit3 size={16} /> Edit Policy
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.form
                        key="edit-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 space-y-4"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Policy Title</label>
                            <input
                                {...register("title", { required: true })}
                                type="text"
                                placeholder="e.g. Privacy Policy"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Policy Content (HTML Supported)</label>
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field }) => (
                                        <JoditEditor
                                            ref={editor}
                                            value={field.value}
                                            config={JODIT_CONFIG}
                                            onBlur={(newContent) => field.onChange(newContent)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                                disabled={isLoading || uLoading}
                            >
                                <Save size={18} /> {id ? (uLoading ? "Updating..." : "Update Policy") : (isLoading ? "Adding..." : "Add Policy")}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); reset(); }}
                                className="px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest border border-gray-100 hover:bg-gray-50 transition-all text-gray-400 flex items-center justify-center gap-2"
                            >
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    // --- SHOW CONTENT ---
                    <motion.div
                        key="show-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden"
                    >
                        {/* Decorative Background Icon */}
                        <ShieldCheck className="absolute -top-10 -right-10 text-gray-50 size-64 z-0" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 uppercase tracking-tighter italic">
                                {policyData?.title}
                            </h2>
                            <div className="prose prose-slate max-w-none prose-p:text-gray-600 prose-headings:text-slate-900 prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-primary">
                                {policyData?.content && parser(policyData?.content)}
                            </div>
                        </div>

                        {/* Empty State Check */}
                        {!policyData?.content && (
                            <div className="text-center py-20">
                                <p className="text-gray-400 italic">No policy content added yet.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}