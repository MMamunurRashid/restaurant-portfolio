import { useForm } from 'react-hook-form';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { TResponse } from '@/interface/globalInterface';
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hooks';
import { userLogout } from '@/redux/features/user/authSlice';

export default function UpdatePassword() {
    const { loggedUser } = useAppSelector(state => state.auth);
    const id = loggedUser?._id || '';
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const dispatch = useAppDispatch();

    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
    const { register, handleSubmit, formState: { errors }, } = useForm<any>();

    const onSubmit = async (data: any) => {
        if (data.newPassword !== data.confirmPassword) {
            return toast.error("New passwords do not match!");
        }

        const newData = {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        }

        const res = await updatePassword({ id, data: newData }) as TResponse;

        if (res?.data?.success) {
            toast.success("Password updated successfully!");
            dispatch(userLogout())
        } else {
            toast.error(res?.error?.data?.message || "Failed to change password");
            console.log(res);

        }

    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/admin/profile/my-profile" className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">Security Settings</h1>
                        <p className="text-slate-500 text-xs mt-0.5 font-medium">Update your account password regularly.</p>
                    </div>
                </div>
                <div className="hidden sm:block p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Lock size={24} />
                </div>
            </div>

            {/* Form Card */}
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold">Change Password</h2>
                        <p className="text-slate-400 text-xs font-medium">Ensure your new password is strong and unique.</p>
                    </div>
                    <KeyRound size={32} className="text-slate-700" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                        <div className="relative group">
                            <input
                                type={showOld ? "text" : "password"}
                                {...register("oldPassword", { required: "Current password is required" })}
                                className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                                placeholder="Enter current password"
                            />
                            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.oldPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.oldPassword.message as string}</p>}
                    </div>

                    <hr className="border-slate-100" />

                    {/* New Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 font-sans">New Password</label>
                            <div className="relative group">
                                <input
                                    type={showNew ? "text" : "password"}
                                    {...register("newPassword", {
                                        required: "New password is required",
                                        minLength: { value: 6, message: "Min 6 characters" }
                                    })}
                                    className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.newPassword.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm New</label>
                            <input
                                type="password"
                                {...register("confirmPassword", { required: "Please confirm your password" })}
                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword.message as string}</p>}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="admin_primary_btn w-full py-4 flex items-center justify-center gap-3 text-base shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isLoading ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"></span> : <ShieldCheck size={20} />}
                            {isLoading ? 'Updating Security...' : 'Confirm Password Change'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Notice */}
            <div className="max-w-3xl mx-auto flex items-start gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm shrink-0">
                    <ShieldCheck size={20} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-900">Security Recommendation</h4>
                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                        Changing your password terminates all other active sessions. You will need to log back in on your other devices after this process is complete.
                    </p>
                </div>
            </div>
        </div>
    );
}