import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Image as ImageIcon, Layout, ArrowUpDown } from 'lucide-react';
import { API_URL } from '@/config';
import toast from 'react-hot-toast';
import { useDeleteBannerMutation, useGetAllBannerQuery } from '@/redux/features/banner/bannerApi';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';

export default function AllBanner() {
    const { data, isLoading } = useGetAllBannerQuery({});
    const [deleteBanner] = useDeleteBannerMutation();
    const banners = data?.data || [];

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            const res = await deleteBanner(id) as TResponse;
            if (res?.data?.success) {
                toast.success(res.data.message || "Banner deleted successfully");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
            }
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Layout size={20} />
                        </div>
                        Banner Management
                    </h1>
                    <p className="text-slate-500 text-xs mt-1.5 ml-10">
                        Manage your homepage hero section. <span className="text-slate-300 mx-1">|</span> Total <span className="font-semibold text-slate-700">{banners.length}</span> Banners
                    </p>
                </div>
                <Link
                    to="/admin/setting/banner/add"
                    className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                    <Plus size={16} />
                    Add Banner
                </Link>
            </div>

            {/* Table Section */}
            <div className="bg-base-100 rounded-2xl border shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th>
                                    <div className="flex items-center gap-1.5 cursor-default">
                                        Order <ArrowUpDown size={12} className="text-slate-400" />
                                    </div>
                                </th>
                                <th>Banner Preview</th>
                                <th>Details</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? <TableSkeleton columns={4} /> : banners?.length > 0 ? (
                                banners?.map((banner: any) => (
                                    <tr key={banner._id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                        <td>
                                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                {banner?.order}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="relative w-32 h-18 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm transition-transform duration-300 group-hover:ring-2 group-hover:ring-primary/10">
                                                <img
                                                    src={`${API_URL}${banner?.image}`}
                                                    alt={banner?.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e: any) => e.target.src = 'https://placehold.co/600x400?text=No+Image'}
                                                    loading='lazy'
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="max-w-50 md:max-w-xs space-y-1">
                                                <h4 className="font-bold text-slate-800 text-[14px] leading-tight group-hover:text-primary transition-colors">
                                                    {banner?.title}
                                                </h4>
                                                <p className="text-xs text-slate-400 line-clamp-1 italic">
                                                    {banner?.description || "No description provided."}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2.5">
                                                <Link
                                                    to={`/admin/setting/banner/edit/${banner?._id}`}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                                                    title="Edit Banner"
                                                >
                                                    <Edit size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(banner?._id)}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shadow-sm"
                                                    title="Delete Banner"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                                                <ImageIcon size={40} strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-slate-600 font-semibold">No banners found</p>
                                                <p className="text-slate-400 text-xs">Start building your slider by adding your first banner.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}