import { Plus, Edit, Trash2, Search, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import { useState } from 'react';
import Pagination from '@/components/shared/Pagination';
import type { IPackage } from '@/interface/packageInterface';
import { useDeletePackageMutation, useGetAllPackageQuery, useToggleFeaturedPackageMutation, useTogglePopularPackageMutation } from '@/redux/features/packages/packagesApi';
import { getMediaUrl } from '@/utils/media';

export default function AllPackage() {
    const [page, setPage] = useState(1);

    // --- New Filter States ---
    const [searchTerm, setSearchTerm] = useState('');

    // API Query with Filter Parameters
    const { data, isLoading } = useGetAllPackageQuery({
        page,
        limit: 10,
        search: searchTerm,
        sort: 'order,createdAt',
    });
    const packages = data?.data || [];

    const [deletePackage] = useDeletePackageMutation();
    const [toggleFeaturedPackage] = useToggleFeaturedPackageMutation();
    const [togglePopularPackage] = useTogglePopularPackageMutation();

    // --- All Previous Logic Kept Intact ---
    const handleDelete = async (id: string) => {
        if (window.confirm("Permanent delete this dining package?")) {
            const res = await deletePackage(id) as TResponse;
            if (res?.data?.success) {
                toast.success(res.data.message || "Dining package deleted successfully");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
            }
        }
    };

    const handleToggleFeaturedStatus = async (id: string) => {
        if (!id) return;
        if (window.confirm("Change featured status of this dining package?")) {
            const res = await toggleFeaturedPackage(id) as TResponse;
            if (res?.data?.success) {
                toast.success("Dining package featured status updated successfully");
            }
        }
    };

    const handleTogglePopularStatus = async (id: string) => {
        if (!id) return;
        if (window.confirm("Change popular status of this dining package?")) {
            const res = await togglePopularPackage(id) as TResponse;
            if (res?.data?.success) {
                toast.success("Dining package popular status updated successfully");
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
                    <h1 className="text-xl font-bold text-neutral">Dining Package Inventory</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage {data?.meta?.total || 0} dining packages and their visibility.</p>
                </div>
                <Link to="/admin/package/add" className="admin_primary_btn">
                    <Plus size={18} /> Add Dining Package
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
                                <th className="p-4">Order</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Featured</th>
                                <th className="p-4">Popular</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? <TableSkeleton columns={6} /> : packages?.length > 0 ? packages?.map((item: IPackage) => (
                                <tr key={item?._id} className="hover:bg-slate-50/50 transition-all">
                                    <td>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                            {item?.order ?? 0}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            {item?.thumbnail && (
                                                <img src={getMediaUrl(item.thumbnail)} alt={item?.title} className="h-12 w-16 rounded-lg border border-slate-200 object-cover" loading="lazy" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-neutral">{item?.title}</p>
                                                {item?.description && <p className="line-clamp-1 text-xs text-slate-400">{item.description}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="text-sm font-medium text-neutral">BDT {item?.price?.toLocaleString?.('en-BD') || item?.price}</p>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-6">
                                            {/* Featured Toggle */}
                                            <button onClick={() => handleToggleFeaturedStatus(item?._id)} className="flex flex-col items-center gap-1 group">
                                                <Star size={16} className={`${item?.isFeatured ? 'text-secondary' : 'text-slate-300'}`} />
                                                <span className="text-[9px] font-bold text-slate-400 group-hover:text-secondary">Featured</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-6">
                                            {/* Popular Toggle */}
                                            <button onClick={() => handleTogglePopularStatus(item?._id)} className="flex flex-col items-center gap-1 group">
                                                <TrendingUp size={16} className={`${item?.isPopular ? 'text-primary' : 'text-slate-300'}`} />
                                                <span className="text-[9px] font-bold text-slate-400 group-hover:text-primary">Popular</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end">
                                            <Link to={`/admin/package/edit/${item?._id}`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all">
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(item?._id)} className="p-2 hover:bg-destructive/10 rounded-lg text-slate-400 hover:text-destructive transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-slate-400 text-sm">No dining packages found.</td>
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
