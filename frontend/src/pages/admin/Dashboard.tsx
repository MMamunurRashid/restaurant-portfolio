import type { IMessage } from '@/interface/messageInterface';
import { useGetBlogCountQuery } from '@/redux/features/blog/blogApi';
import { useGetAllMessageQuery, useGetMessageCountQuery } from '@/redux/features/contactMessage/contactMessageApi';
import { useGetServiceCountQuery } from '@/redux/features/service/serviceApi';
import { useGetTeamCountQuery } from '@/redux/features/team/teamApi';
import { useGetUserCountQuery } from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hook/hooks';
import {
    Building2, MessageSquare, Users, BookOpen,
    TrendingUp, User, ArrowRight, Calendar, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { loggedUser } = useAppSelector((state) => state.auth);
    const { data: serviceCount } = useGetServiceCountQuery({});
    const { data: messageCount } = useGetMessageCountQuery({});
    const { data: userCount } = useGetUserCountQuery({});
    const { data: blogCount } = useGetBlogCountQuery({});
    const { data: teamCount } = useGetTeamCountQuery({});

    const { data: message } = useGetAllMessageQuery({ limit: 6 });
    const messages = message?.data || [];

    const stats = [
        { label: 'Total Services', count: serviceCount?.data?.totalService || 0, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/projects/all' },
        { label: 'Unread Messages', count: messageCount?.data?.unreadMessages || 0, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/contact-message' },
        { label: 'Active Blogs', count: blogCount?.data?.totalBlogs || 0, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/blogs/all' },
        { label: 'System Users', count: userCount?.data?.totalUsers || 0, icon: User, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/user-role/user-management' },
    ];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-700">

            {/* 1. Welcoming Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Hello, {loggedUser?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        System overview and recent activity for today.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                    <span className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700">
                        <Calendar size={16} className="text-primary" />
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* 2. Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <Link
                        key={idx}
                        to={stat.link}
                        className="group bg-white border border-slate-200 p-5 rounded-3xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className={`inline-flex p-3 rounded-2xl ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.count}</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider">{stat.label}</p>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight size={18} className="text-slate-300" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 3. Recent Inquiries (Main Section) */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                                    <Bell size={20} />
                                </div>
                                <h3 className="font-black text-slate-800 text-lg">Latest Inquiries</h3>
                            </div>
                            <Link to="/admin/contact-message" className="text-xs font-bold text-primary hover:underline">View All</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-4">Sender Info</th>
                                        <th className="px-6 py-4">Message Snippet</th>
                                        <th className="px-8 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {messages.map((item: IMessage, i: number) => (
                                        <tr key={i} className="group hover:bg-slate-50/80 transition-all cursor-default">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs uppercase">
                                                        {item?.name?.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{item?.name}</p>
                                                        <p className="text-[11px] text-slate-400 font-medium">{item?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs text-slate-500 line-clamp-1 italic max-w-50">
                                                    "{item?.message}"
                                                </p>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="opacity-0 group-hover:opacity-100 bg-white border border-slate-200 px-4 py-1.5 rounded-lg text-xs font-black text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                                    Open
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 4. Right Sidebar (Tools) */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Management Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Users size={20} />
                            </div>
                            <h3 className="font-black text-slate-800">Team Management</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                            <span className="text-sm font-bold text-slate-500">Total Members</span>
                            <span className="text-xl font-black text-slate-800">{teamCount?.data?.totalTeams || 0}</span>
                        </div>

                        <Link
                            to="/admin/about/team/all"
                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                            Manage Team Members
                        </Link>
                    </div>

                    {/* SEO Quick Card */}
                    <div className="bg-linear-to-br from-indigo-600 to-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <TrendingUp className="absolute -right-6 -bottom-6 text-white/10 rotate-12 group-hover:scale-125 transition-transform duration-500" size={160} />

                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2">Performance</h3>
                            <p className="text-indigo-100 text-xs font-medium mb-8 leading-relaxed">
                                Optimize your website's visibility and search engine ranking.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Link to="/admin/setting/general" className="bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 rounded-xl text-[11px] font-black text-center transition-all uppercase tracking-wider">
                                    General
                                </Link>
                                <Link to="/admin/seo" className="bg-white text-primary py-3 rounded-xl text-[11px] font-black text-center transition-all uppercase tracking-wider shadow-lg">
                                    SEO Fix
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}