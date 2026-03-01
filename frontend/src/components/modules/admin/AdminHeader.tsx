import { useState } from "react";
import { Menu, ExternalLink, LogOut, User, ChevronDown, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hooks";
import { CONFIG } from "@/config";
import { userLogout } from "@/redux/features/user/authSlice";

interface AdminHeaderProps {
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function AdminHeader({ setIsSidebarOpen }: AdminHeaderProps) {
    const { loggedUser } = useAppSelector((state) => state.auth);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dispatch = useAppDispatch();

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6 shadow-sm shadow-slate-50">

            {/* Left Section */}
            <div className="flex items-center gap-3">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex lg:hidden items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                >
                    <Menu size={20} />
                </button>

                {/* Frontend Quick Link */}
                <Link
                    to="/"
                    target="_blank"
                    className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-lg text-sm font-medium transition-all group"
                >
                    <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Live Website</span>
                </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">

                {/* User Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-3 p-1.5 rounded-xl border transition-all ${isProfileOpen ? 'border-primary/20 bg-primary/5' : 'border-transparent hover:bg-slate-50'
                            }`}
                    >
                        <div className="relative">
                            <img
                                src={loggedUser?.profileUrl ? CONFIG.BASE_URL + loggedUser.profileUrl : `https://ui-avatars.com/api/?name=${loggedUser?.name}&background=f8fafc&color=475569&bold=true`}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 bg-slate-100"
                                alt="Admin"
                            />
                            {/* Online Indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>

                        <div className="hidden md:block text-left pr-1">
                            <p className="text-[13px] font-semibold text-slate-800 leading-tight">
                                {loggedUser?.name || "Admin User"}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                {loggedUser?.role || "Super Admin"}
                            </p>
                        </div>

                        <ChevronDown
                            size={14}
                            className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-primary' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                        <>
                            {/* Backdrop to close */}
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>

                            <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/40 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">

                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
                                </div>

                                <Link
                                    to="/admin/profile/my-profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <User size={16} />
                                    </div>
                                    <span className="font-medium">My Profile</span>
                                </Link>

                                <Link
                                    to="/admin/setting/general"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Settings size={16} />
                                    </div>
                                    <span className="font-medium">Settings</span>
                                </Link>

                                <div className="h-px bg-slate-100 my-2 mx-4"></div>

                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        dispatch(userLogout());
                                    }}
                                    className="w-[calc(100%-16px)] mx-2 flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                        <LogOut size={16} />
                                    </div>
                                    <span className="font-bold">Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}