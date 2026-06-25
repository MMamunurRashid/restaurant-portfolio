import { Badge } from '@/components/ui/badge';
import { CONFIG } from '@/config';
import type { IAppointment, TAppointmentStatus } from '@/interface/appointmentInterface';
import { useGetAllAppointmentQuery, useGetAppointmentCountQuery } from '@/redux/features/appointment/appointmentApi';
import { useGetBlogCountQuery } from '@/redux/features/blog/blogApi';
import { useGetMessageCountQuery } from '@/redux/features/contactMessage/contactMessageApi';
import { useGetPackageCountQuery } from '@/redux/features/packages/packagesApi';
import { useGetServiceCountQuery } from '@/redux/features/service/serviceApi';
import { useGetTeamCountQuery } from '@/redux/features/team/teamApi';
import { useAppSelector } from '@/redux/hook/hooks';
import {
    MessageSquare, Users, BookOpen,
    TrendingUp, ArrowRight, Calendar, Bell,
    UtensilsCrossed,
    NotebookPen,
    Armchair,
    Clock,
    CalendarDays,  
} from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_BADGE: Record<TAppointmentStatus, string> = {
    pending: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/10',
    confirmed: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
    no_show: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100',
};


const STATUS_LABEL: Record<TAppointmentStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    no_show: 'No-show',
};

export default function Dashboard() {
    const { loggedUser } = useAppSelector((state) => state.auth);
    const { data: serviceCount } = useGetServiceCountQuery({});
    const { data: messageCount } = useGetMessageCountQuery({});
    const { data: blogCount } = useGetBlogCountQuery({});
    const { data: teamCount } = useGetTeamCountQuery({});
    const { data: appointmentCount } = useGetAppointmentCountQuery({});
    const { data: packagesCount } = useGetPackageCountQuery({});

    const { data: appointments } = useGetAllAppointmentQuery({ limit: 6 });
    const appointmentList = appointments?.data || [];

    const stats = [
        { label: 'Reservations', count: appointmentCount?.data?.totalAppointments || 0, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/appointments/all' },
        { label: 'Menu Items', count: serviceCount?.data?.totalService || 0, icon: UtensilsCrossed, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/services/all' },
        { label: 'Dining Packages', count: packagesCount?.data?.totalPackages || 0, icon: NotebookPen, color: 'text-secondary', bg: 'bg-secondary/10', link: '/admin/packages/all' },
        { label: 'Unread Messages', count: messageCount?.data?.unreadMessages || 0, icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/contact-message' },
        { label: 'Journal Posts', count: blogCount?.data?.totalBlogs || 0, icon: BookOpen, color: 'text-secondary', bg: 'bg-secondary/10', link: '/admin/blogs/all' },
    ];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-700">

            {/* 1. Welcoming Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome, {loggedUser?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Restaurant operations, reservations, and recent guest activity.
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                                <h3 className="font-black text-slate-800 text-lg">Latest Reservations</h3>
                            </div>
                            <Link to="/admin/appointments/all" className="text-xs font-bold text-primary hover:underline">View All</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Guest</th>                                        
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Package</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Schedule</th>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {appointmentList.map((appointment: IAppointment, i: number) => {
                                        const status = appointment.status || 'pending';

                                        return (
                                            <tr key={appointment._id || i} className="group hover:bg-slate-50/50 transition-all">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {appointment.name.charAt(0)}
                                                            {!appointment.isRead && (
                                                                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-secondary ring-2 ring-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-700">{appointment.name}</p>
                                                            <p className="text-[10px] font-mono text-slate-400">
                                                                {appointment.reservationCode || `RES-${appointment._id.slice(-6).toUpperCase()}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>                                            
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            {appointment.packages && appointment.packages.length > 0 && appointment.packages[0]?.thumbnail && (
                                                                <img src={CONFIG.BASE_URL + appointment.packages[0].thumbnail} alt="" className="w-6 h-6 rounded object-cover" />
                                                            )}
                                                            <p className="text-sm font-semibold text-primary line-clamp-1">
                                                                {(appointment.packages && appointment.packages[0]?.title) || 'General Reservation'}
                                                                {appointment.packages && appointment.packages.length > 1 ? ` +${appointment.packages.length - 1} more` : ''}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                                            <Users size={11} /> {appointment.guestCount || 1} guests
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1 text-[11px] font-bold text-slate-500 uppercase">
                                                        <div className="flex items-center gap-1.5">
                                                            <CalendarDays size={12} className="text-slate-400" />
                                                            {new Date(appointment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} className="text-slate-400" />
                                                            {appointment.time ? formatTime(appointment.time) : 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Armchair size={12} className="text-slate-400" />
                                                            {formatAssignedTable(appointment)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={`border shadow-none ${STATUS_BADGE[status]}`}>
                                                        {STATUS_LABEL[status]}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
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
                            <h3 className="font-black text-slate-800">Restaurant Team</h3>
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
                    <div className="bg-linear-to-br from-primary to-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <TrendingUp className="absolute -right-6 -bottom-6 text-white/10 rotate-12 group-hover:scale-125 transition-transform duration-500" size={160} />

                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-2">Performance</h3>
                            <p className="text-primary-foreground/70 text-xs font-medium mb-8 leading-relaxed">
                                Keep your restaurant profile, search visibility, and marketing pages ready.
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

function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function formatAssignedTable(appointment: IAppointment) {
    const tableNumber = appointment.assignedTable?.tableNumber || appointment.tableSnapshot?.tableNumber;
    return tableNumber ? `Table ${tableNumber}` : 'Unassigned';
}