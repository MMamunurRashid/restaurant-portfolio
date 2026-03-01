import { X, Mail, Phone, User, Clock, Paperclip, MessageSquare } from 'lucide-react';

export default function MessageModal({ message, onClose }: { message: any, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-99 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Mail className="text-primary" size={18} /> Inquiry Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Email Template Body */}
                <div className="p-8 space-y-8">
                    {/* Meta Info Box */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Sender Name</p>
                                <p className="text-sm font-bold text-slate-700">{message.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                <p className="text-sm font-bold text-slate-700">{message.email || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                                <p className="text-sm font-bold text-slate-700">{message.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Date Received</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {new Date(message.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* The Message Content */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Paperclip size={14} /> Message Content
                        </div>
                        <div className="bg-blue-50/30 p-8 rounded-3xl border border-blue-100/50 relative">
                            <div className="absolute top-4 right-6 text-blue-100">
                                <MessageSquare size={40} />
                            </div>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm relative z-10">
                                {message.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 px-8 py-5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        Close
                    </button>
                    {message.email && (
                        <a
                            href={`mailto:${message.email}`}
                            className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
                        >
                            <Mail size={16} /> Reply via Email
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}