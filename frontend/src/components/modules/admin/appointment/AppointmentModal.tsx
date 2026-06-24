import { useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { X, Mail, Layout, CheckCircle2, XCircle, ClipboardCheck, Ban, Save, Armchair, BellRing } from 'lucide-react';
import type { IAppointment, TAppointmentStatus } from '@/interface/appointmentInterface';
import type { TResponse } from '@/interface/globalInterface';
import AdminAppointmentReceipt from '@/components/shared/AdminAppointmentReceipt';
import {
    useAssignAppointmentTableMutation,
    useMarkAppointmentAsReadMutation,
    useSendAppointmentReminderMutation,
    useUpdateAppointmentMutation,
} from '@/redux/features/appointment/appointmentApi';
import { useGetAllDiningTableQuery } from '@/redux/features/diningTable/diningTableApi';
import type { IDiningTable } from '@/interface/diningTableInterface';
import toast from 'react-hot-toast';

type AppointmentModalProps = {
    appointment: IAppointment;
    onClose: () => void;
};

const ACTIONS: Array<{
    label: string;
    status: TAppointmentStatus;
    icon: ElementType;
    className: string;
}> = [
    {
        label: 'Confirm',
        status: 'confirmed',
        icon: CheckCircle2,
        className: 'border-primary text-primary hover:bg-primary hover:text-white',
    },
    {
        label: 'Cancel',
        status: 'cancelled',
        icon: XCircle,
        className: 'border-destructive text-destructive hover:bg-destructive hover:text-white',
    },
    {
        label: 'Complete',
        status: 'completed',
        icon: ClipboardCheck,
        className: 'border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white',
    },
    {
        label: 'No-show',
        status: 'no_show',
        icon: Ban,
        className: 'border-slate-300 text-slate-600 hover:bg-slate-800 hover:text-white',
    },
];

export default function AppointmentModal({ appointment, onClose }: AppointmentModalProps) {
    const [currentAppointment, setCurrentAppointment] = useState(appointment);
    const [adminNotes, setAdminNotes] = useState(appointment.adminNotes || '');
    const [cancelReason, setCancelReason] = useState(appointment.cancelReason || '');
    const [selectedTableId, setSelectedTableId] = useState(
        appointment.assignedTable?._id || appointment.tableSnapshot?.table || ''
    );
    const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
    const [markAsRead] = useMarkAppointmentAsReadMutation();
    const [assignTable, { isLoading: isAssigning }] = useAssignAppointmentTableMutation();
    const [sendReminder, { isLoading: isSendingReminder }] = useSendAppointmentReminderMutation();
    const { data: tableData } = useGetAllDiningTableQuery({
        limit: 100,
        isActive: true,
        sort: 'sortOrder,tableNumber',
    });
    const diningTables = (tableData?.data || []) as IDiningTable[];

    useEffect(() => {
        setCurrentAppointment(appointment);
        setAdminNotes(appointment.adminNotes || '');
        setCancelReason(appointment.cancelReason || '');
        setSelectedTableId(appointment.assignedTable?._id || appointment.tableSnapshot?.table || '');
    }, [appointment]);

    useEffect(() => {
        if (!appointment._id || appointment.isRead) return;

        const markRead = async () => {
            const res = await markAsRead(appointment._id) as TResponse;
            if (res?.data?.success) {
                setCurrentAppointment(res.data.data as IAppointment);
            }
        };

        markRead();
    }, [appointment._id, appointment.isRead, markAsRead]);

    const updateReservation = async (data: Partial<IAppointment>, successMessage: string) => {
        const res = await updateAppointment({ id: currentAppointment._id, data }) as TResponse;

        if (res?.data?.success) {
            setCurrentAppointment(res.data.data as IAppointment);
            toast.success(successMessage);
            return;
        }

        toast.error(
            Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                ? `${res?.error?.data?.error[0]?.path || ''} ${res?.error?.data?.error[0]?.message || ''}`.trim()
                : res?.error?.data?.message || 'Something went wrong!'
        );
    };

    const handleStatusUpdate = (status: TAppointmentStatus) => {
        updateReservation(
            {
                status,
                adminNotes,
                cancelReason: status === 'cancelled' ? cancelReason : currentAppointment.cancelReason,
            },
            `Reservation marked as ${status.replace('_', '-')}`
        );
    };

    const handleSaveNotes = () => {
        updateReservation(
            { adminNotes, cancelReason },
            'Reservation notes saved'
        );
    };

    const handleAssignTable = async () => {
        const res = await assignTable({
            id: currentAppointment._id,
            tableId: selectedTableId || null,
        }) as TResponse;

        if (res?.data?.success) {
            setCurrentAppointment(res.data.data as IAppointment);
            toast.success(res.data.message || 'Table assignment updated');
            return;
        }

        toast.error(
            Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                ? `${res?.error?.data?.error[0]?.path || ''} ${res?.error?.data?.error[0]?.message || ''}`.trim()
                : res?.error?.data?.message || 'Something went wrong!'
        );
    };

    const handleClearTable = async () => {
        const res = await assignTable({
            id: currentAppointment._id,
            tableId: null,
        }) as TResponse;

        if (res?.data?.success) {
            setSelectedTableId('');
            setCurrentAppointment(res.data.data as IAppointment);
            toast.success(res.data.message || 'Table assignment removed');
            return;
        }

        toast.error(
            Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                ? `${res?.error?.data?.error[0]?.path || ''} ${res?.error?.data?.error[0]?.message || ''}`.trim()
                : res?.error?.data?.message || 'Something went wrong!'
        );
    };

    const handleSendReminder = async () => {
        const res = await sendReminder(currentAppointment._id) as TResponse;

        if (res?.data?.success) {
            setCurrentAppointment(res.data.data as IAppointment);
            toast.success(res.data.message || 'Reminder sent');
            return;
        }

        toast.error(
            Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                ? `${res?.error?.data?.error[0]?.path || ''} ${res?.error?.data?.error[0]?.message || ''}`.trim()
                : res?.error?.data?.message || 'Something went wrong!'
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
                <div className="sticky top-0 z-30 bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layout className="text-primary" size={18} /> Reservation Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 md:p-8">
                    <AdminAppointmentReceipt appointment={currentAppointment} />

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">
                                Reservation Actions
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {ACTIONS.map((action) => {
                                    const Icon = action.icon;
                                    const isActive = currentAppointment.status === action.status;

                                    return (
                                        <button
                                            key={action.status}
                                            type="button"
                                            onClick={() => handleStatusUpdate(action.status)}
                                            disabled={isUpdating || isActive}
                                            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
                                        >
                                            <Icon size={14} />
                                            {isActive ? 'Current' : action.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                <Armchair size={14} className="text-primary" />
                                Table Assignment
                            </p>
                            <select
                                value={selectedTableId}
                                onChange={(e) => setSelectedTableId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Unassigned</option>
                                {diningTables.map((table) => (
                                    <option
                                        key={table._id}
                                        value={table._id}
                                        disabled={table.capacity < (currentAppointment.guestCount || 1)}
                                    >
                                        Table {table.tableNumber}
                                        {table.area ? ` - ${table.area}` : ''}
                                        {` (${table.capacity} guests)`}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleAssignTable}
                                    disabled={isAssigning}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-60"
                                >
                                    <Armchair size={14} />
                                    Assign
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearTable}
                                    disabled={
                                        isAssigning ||
                                        (!currentAppointment.assignedTable && !currentAppointment.tableSnapshot)
                                    }
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-4">
                            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                                <BellRing size={14} />
                                Guest Reminder
                            </p>
                            <p className="mb-3 text-xs font-medium leading-5 text-slate-500">
                                Sends a reminder email for confirmed reservations only.
                            </p>
                            {currentAppointment.reminderSentAt && (
                                <p className="mb-3 text-[11px] font-semibold text-slate-500">
                                    Last sent: {new Date(currentAppointment.reminderSentAt).toLocaleString('en-BD')}
                                </p>
                            )}
                            <button
                                type="button"
                                onClick={handleSendReminder}
                                disabled={
                                    isSendingReminder ||
                                    currentAppointment.status !== 'confirmed' ||
                                    !currentAppointment.email
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <BellRing size={14} />
                                {isSendingReminder ? 'Sending...' : 'Send Reminder'}
                            </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                Internal Notes
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={4}
                                className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="Call notes, table preference, payment note..."
                            />

                            <label className="mb-2 mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                Cancel Reason
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                rows={3}
                                className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="Only needed if the reservation is cancelled."
                            />

                            <button
                                type="button"
                                onClick={handleSaveNotes}
                                disabled={isUpdating}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-60"
                            >
                                <Save size={15} />
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 z-30 bg-slate-50 px-8 py-5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
                        Close
                    </button>
                    {currentAppointment.email && (
                        <a href={`mailto:${currentAppointment.email}`} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
                            <Mail size={16} /> Contact Guest
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
