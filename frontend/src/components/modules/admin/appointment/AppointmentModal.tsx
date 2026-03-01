import { X, Mail, Phone, User, Clock, Layout } from 'lucide-react';
import type { IAppointment } from '@/interface/appointmentInterface';
import parser from "html-react-parser"

export default function AppointmentModal({ appointment, onClose }: { appointment: IAppointment, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layout className="text-primary" size={18} /> Appointment Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Client Name</p>
                                <p className="text-sm font-bold text-slate-700">{appointment.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                <p className="text-sm font-bold text-slate-700">{appointment.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                                <p className="text-sm font-bold text-slate-700">{appointment.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Booking Date</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {new Date(appointment.date).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Project Details Box */}
                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                            <Layout size={14} /> Interested Service
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{appointment.service?.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{
                            appointment.service?.description && parser(appointment.service?.description)
                        }</p>
                    </div>
                </div>

                <div className="bg-slate-50 px-8 py-5 flex justify-end gap-3">
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