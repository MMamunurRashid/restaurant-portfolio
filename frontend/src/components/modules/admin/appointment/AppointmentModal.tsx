import { X, Mail, Layout } from 'lucide-react';
import type { IAppointment } from '@/interface/appointmentInterface';
import AdminAppointmentReceipt from '@/components/shared/AdminAppointmentReceipt';

export default function AppointmentModal({ appointment, onClose }: { appointment: IAppointment, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="sticky top-0 z-30 bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layout className="text-primary" size={18} /> Appointment Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">
                    <AdminAppointmentReceipt appointment={appointment} />
                </div>

                <div className="sticky bottom-0 z-30 bg-slate-50 px-8 py-5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
                        Close
                    </button>
                    {appointment.email && (
                        <a href={`mailto:${appointment.email}`} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
                            <Mail size={16} /> Contact Client
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}