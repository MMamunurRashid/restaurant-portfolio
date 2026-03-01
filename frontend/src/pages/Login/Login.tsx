import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useLoginMutation } from '../../redux/features/user/authApi';
import { userLoggedIn, type TUser } from '../../redux/features/user/authSlice';
import { useState } from 'react';
import type { TResponse } from '@/interface/globalInterface';
import toast from 'react-hot-toast';
import verifyToken from '@/utils/verifyToken';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [login, { isLoading }] = useLoginMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email: '', password: '' }
    });

    const from = location.state?.from?.pathname || "/admin/dashboard";

    const onSubmit = async (data: { email: string; password: string }) => {
        setErrorMessage(null);
        const res = await login(data) as TResponse;

        if (res?.data?.success) {
            toast.success('Login Successful');
            const user = verifyToken(res?.data?.data?.accessToken) as TUser;
            dispatch(userLoggedIn({ user, token: res?.data?.data?.accessToken }));
            navigate(from, { replace: true });
        } else {
            setErrorMessage(Array.isArray(res?.error?.data?.error) &&
                res?.error?.data?.error.length > 0
                ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                : res?.error?.data?.message || res?.error?.error || "Something went wrong!");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Soft decorative background circles using secondary color opacity */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 relative z-10">

                {/* Branding Section */}
                <div className="text-center space-y-3 mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-2">
                        <Sparkles className="text-primary" size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Portal</h2>
                </div>

                {errorMessage && (
                    <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} />
                        <p className="text-xs font-bold leading-tight">{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                                })}
                                type="email"
                                placeholder="admin@salon.com"
                                className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 ${errors.email ? 'border-red-200' : 'border-slate-100 focus:border-primary/30'}`}
                            />
                        </div>
                        {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                {...register("password", { required: "Password is required" })}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/5 ${errors.password ? 'border-red-200' : 'border-slate-100 focus:border-primary/30'}`}
                            />
                        </div>
                        {errors.password && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <span className="tracking-wide text-sm">Sign In to Dashboard</span>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-slate-50 text-center">
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-semibold">
                        &copy; {new Date().getFullYear()} RA Beauty Canvas
                    </p>
                </div>
            </div>
        </div>
    );
}