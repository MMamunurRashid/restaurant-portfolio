import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import { CONFIG } from '@/config';
import { useState } from 'react';
import Pagination from '@/components/shared/Pagination';
import type { IService } from '@/interface/serviceInterface';
import { useDeleteServiceMutation, useGetAllServiceQuery, useToggleStatusServiceMutation } from '@/redux/features/service/serviceApi';

export default function AllService() {
    const [page, setPage] = useState(1);

    // --- New Filter States ---
    const [searchTerm, setSearchTerm] = useState('');

    // API Query with Filter Parameters
    const { data, isLoading } = useGetAllServiceQuery({
        page,
        limit: 10,
        search: searchTerm,
    });
    const services = data?.data || [];

    const [deleteService] = useDeleteServiceMutation();
    const [toggleStatusService] = useToggleStatusServiceMutation();

    // --- All Previous Logic Kept Intact ---
    const handleDelete = async (id: string) => {
        if (window.confirm("Permanent delete this project?")) {
            const res = await deleteService(id) as TResponse;
            if (res?.data?.success) {
                toast.success(res.data.message || "Project deleted successfully");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
            }
        }
    };

    const handleToggleActiveStatus = async (id: string) => {
        if (!id) return;
        if (window.confirm("Change active status of this project?")) {
            const res = await toggleStatusService(id) as TResponse;
            if (res?.data?.success) {
                toast.success("Project status updated successfully");
            } else {
                toast.error(res?.error?.data?.message || "Something went wrong!");
            }
        }
    };


    return (
        <div className="space-y-2 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-neutral">Service Inventory</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage {data?.meta?.total || 0} property listings and their visibility.</p>
                </div>
                <Link to="/admin/service/add" className="admin_primary_btn">
                    <Plus size={18} /> Add New Service
                </Link>
            </div>

            {/* --- Filter Bar Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="pl-10 w-full"
                    />
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="p-4">Project Info</th>
                                <th className="p-4">Icon</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? <TableSkeleton columns={5} /> : services?.length > 0 ? services?.map((item: IService) => (
                                <tr key={item?._id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <img src={CONFIG.BASE_URL + item?.thumbnail} className="w-16 h-12 rounded-lg object-cover border border-slate-200" alt="service" loading='lazy' />
                                            <div>
                                                <p className="font-bold text-neutral text-sm line-clamp-1">{item?.title}</p>
                                                <Link to={`/service/${item?.slug}`}>{item?.slug}</Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <img src={CONFIG.BASE_URL + item?.icon} className="w-12 h-12 rounded-lg object-cover border border-slate-200" alt="service" loading='lazy' />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-6">
                                            {/* Active Toggle */}
                                            <button onClick={() => handleToggleActiveStatus(item?._id)} className="flex flex-col items-center gap-1 group">
                                                <Eye size={16} className={`${item?.isActive ? 'text-green-500' : 'text-slate-300'}`} />
                                                <span className="text-[9px] font-bold text-slate-400 group-hover:text-green-600">Active</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end">
                                            <Link to={`/admin/service/edit/${item?._id}`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all">
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(item?._id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-400 text-sm">No projects found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={data?.meta?.pages || 1}
                onPageChange={(p) => setPage(p)}
            />
        </div>
    );
}