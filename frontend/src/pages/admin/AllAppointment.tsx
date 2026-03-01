import { useState } from 'react';
import { Mail, Phone, Trash2, Eye, MessageSquare, Search, FilterX, } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import { useDeleteAppointmentMutation, useGetAllAppointmentQuery } from '@/redux/features/appointment/appointmentApi';
import type { IAppointment } from '@/interface/appointmentInterface';
import AppointmentModal from '@/components/modules/admin/appointment/AppointmentModal';
import { CONFIG } from '@/config';
import Pagination from '@/components/shared/Pagination';

export default function AllAppointment() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Appointments with Filters
    const { data, isLoading } = useGetAllAppointmentQuery({
        page,
        limit: 10,
        search: searchTerm,
    });

    const appointments = data?.data || [];
    const [deleteAppointment] = useDeleteAppointmentMutation();
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            const res = await deleteAppointment(id) as TResponse;
            if (res?.data?.success) {
                toast.success(res.data.message || "Appointment deleted successfully");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
                console.log(res);
            }
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        setPage(1);
    };

    return (
        <div className="space-y-2 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className='flex items-start gap-2'>
                    <div className="p-2 bg-primary/5 text-primary rounded-lg">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">All Appointments</h1>
                        <p className="text-slate-500 text-xs mt-1">You have {data?.meta?.total || 0} total booking appointments.</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
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



                <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                    <FilterX size={16} /> Reset Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Sender</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Contact</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Service & Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <TableSkeleton columns={4} />
                            ) : appointments.length > 0 ? (
                                appointments?.map((appointment: IAppointment) => (
                                    <tr key={appointment?._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {appointment?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-700">{appointment?.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                    <Mail size={12} className="text-slate-400" /> {appointment?.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                    <Phone size={12} className="text-slate-400" /> {appointment?.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className='flex items-center gap-2'>
                                                    {appointment?.service?.thumbnail && (
                                                        <img src={CONFIG.BASE_URL + appointment?.service?.thumbnail} alt="" className='w-6 h-6 rounded object-cover' />
                                                    )}
                                                    <p className="text-sm font-semibold text-primary line-clamp-1">{appointment?.service?.title || 'General'}</p>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                    {new Date(appointment?.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedAppointment(appointment)}
                                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(appointment?._id)}
                                                    className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-red-600 hover:border-red-600 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-slate-400 text-sm italic">
                                        No appointments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
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