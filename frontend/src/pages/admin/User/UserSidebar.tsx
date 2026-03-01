import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus, Loader2, Mail, BadgeCheck } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editingUser: any;
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

export default function UserSidebar({ isOpen, onClose, editingUser, onSubmit, isLoading }: Props) {
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (isOpen) {
            if (editingUser) {
                reset({
                    name: editingUser?.name,
                    email: editingUser?.email,
                    status: editingUser?.status
                });
            } else {
                reset({
                    name: '',
                    email: '',
                    password: '',
                    status: 'active'
                });
            }
        }
    }, [isOpen, editingUser, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex justify-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">

                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-bold text-lg text-neutral flex items-center gap-2">
                        <UserPlus size={20} className="text-primary" />
                        {editingUser ? 'Update Staff Member' : 'Add New Staff'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Full Name</label>
                        <div className="relative">
                            <input {...register("name", { required: true })} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all" />
                            <BadgeCheck size={18} className="absolute left-3 top-3.5 text-slate-400" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Email Address</label>
                        <div className="relative">
                            <input type="email" {...register("email", { required: true })} placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all" />
                            <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                        </div>
                    </div>

                    {/* password */}
                    {
                        !editingUser && <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Password</label>
                            <div className="relative">
                                <input type="password" {...register("password", { required: true })} placeholder="********" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all" />
                                <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            </div>
                        </div>

                    }
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                    <button disabled={isLoading} onClick={handleSubmit(onSubmit)} className="admin_primary_btn flex-1 py-4 justify-center">
                        {isLoading ? <Loader2 className="animate-spin" /> : editingUser ? 'Update User' : 'Create User'}
                    </button>
                    <button onClick={onClose} className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50">Cancel</button>
                </div>
            </div>
        </div>
    );
}