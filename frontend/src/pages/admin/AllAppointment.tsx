import { useState } from 'react';
import { Mail, Phone, Trash2, Eye, MessageSquare, Search, FilterX, CalendarDays, Clock, Users, Armchair } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import { useDeleteAppointmentMutation, useGetAllAppointmentQuery } from '@/redux/features/appointment/appointmentApi';
import type { IAppointment, TAppointmentStatus } from '@/interface/appointmentInterface';
import AppointmentModal from '@/components/modules/admin/appointment/AppointmentModal';
import { CONFIG } from '@/config';
import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';

const STATUS_OPTIONS: Array<{ label: string; value: '' | TAppointmentStatus }> = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Completed', value: 'completed' },
    { label: 'No-show', value: 'no_show' },
];

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

export default function AllAppointment() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'' | TAppointmentStatus>('');

    const { data, isLoading } = useGetAllAppointmentQuery({
        page,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
    });

    const appointments = data?.data || [];
    const [deleteAppointment] = useDeleteAppointmentMutation();
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            const res = await deleteAppointment(id) as TResponse;
            if (res?.data?.success) {
                toast.success(res.data.message || 'Reservation deleted successfully');
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ''} ${res?.error?.data?.error[0]?.message || ''}`.trim()
                        : res?.error?.data?.message || 'Something went wrong!'
                );
                console.log(res);
            }
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        setPage(1);
    };

    return (
        <div className="space-y-2 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-start gap-2">
                    <div className="p-2 bg-primary/5 text-primary rounded-lg">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">Table Reservations</h1>
                        <p className="text-slate-500 text-xs mt-1">
                            You have {data?.meta?.total || 0} reservation requests in this view.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_160px] gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="pl-10 w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as '' | TAppointmentStatus); setPage(1); }}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value || 'all'} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                    <FilterX size={16} /> Reset
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Guest</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Contact</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Package</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Schedule</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <TableSkeleton columns={6} />
                            ) : appointments.length > 0 ? (
                                appointments.map((appointment: IAppointment) => {
                                    const status = appointment.status || 'pending';

                                    return (
                                        <tr key={appointment._id} className="group hover:bg-slate-50/50 transition-all">
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
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                        <Mail size={12} className="text-slate-400" /> {appointment.email || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                        <Phone size={12} className="text-slate-400" /> {appointment.phone}
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
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedAppointment(appointment)}
                                                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-primary hover:border-primary transition-all"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(appointment._id)}
                                                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-destructive hover:border-destructive transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-slate-400 text-sm italic">
                                        No reservations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedAppointment && (
                <AppointmentModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}

            <Pagination
                currentPage={page}
                totalPages={data?.meta?.pages || 1}
                onPageChange={(p) => setPage(p)}
            />
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
