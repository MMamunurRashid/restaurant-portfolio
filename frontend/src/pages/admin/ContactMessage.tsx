import { useState } from 'react';
import { Mail, Phone, Trash2, Eye, MessageSquare, Search, FilterX } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDeleteMessageMutation, useGetAllMessageQuery } from '@/redux/features/contactMessage/contactMessageApi';
import type { TResponse } from '@/interface/globalInterface';
import MessageModal from '@/components/modules/admin/message/MessageModal';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import type { IMessage } from '@/interface/messageInterface';
import Pagination from '@/components/shared/Pagination';

export default function ContactMessage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading } = useGetAllMessageQuery({ page, limit: 10, search: searchTerm });
    const [deleteMessage] = useDeleteMessageMutation();
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const messages = data?.data || [];

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                const res = await deleteMessage(id) as TResponse;
                if (res?.data?.success) {
                    toast.success(res.data.message || "Message deleted successfully");
                } else {
                    toast.error(
                        Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                            ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                            : res?.error?.data?.message || "Something went wrong!"
                    );
                    console.log(res);
                }
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to delete message");
                console.log(error);
            }
        }
    };

    // Reset Search
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
                        <h1 className="text-xl font-bold text-neutral">Customer Inquiries</h1>
                        <p className="text-slate-500 text-xs mt-1">You have {data?.meta?.total || 0} total messages from contact form.</p>
                    </div>
                </div>
            </div>


            {/* --- Search Bar --- */}
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="pl-10"
                    />
                </div>
                {searchTerm && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                    >
                        <FilterX size={16} /> Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th>Sender</th>
                                <th>Contact Info</th>
                                <th>Message Preview</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? <TableSkeleton columns={4} /> : messages?.map((msg: IMessage) => (
                                <tr key={msg?._id} className="group hover:bg-slate-50/50 transition-all">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-xs">
                                                {msg?.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-sm">{msg?.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Mail size={12} className="text-slate-400" /> {msg?.email || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Phone size={12} className="text-slate-400" /> {msg?.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="text-sm text-slate-500 truncate max-w-75">{msg?.message}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedMessage(msg)}
                                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg?._id)}
                                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-red-600 hover:border-red-600 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Component */}
            {selectedMessage && (
                <MessageModal
                    message={selectedMessage}
                    onClose={() => setSelectedMessage(null)}
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