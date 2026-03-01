import { Plus, Edit, Trash2, Image as ImageIcon, FilterX, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAllBlogsQuery, useDeleteBlogMutation, useToggleBlogStatusMutation } from '@/redux/features/blog/blogApi';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import { API_URL } from '@/config';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import Pagination from '@/components/shared/Pagination';
import { useState } from 'react';

export default function AllBlogs() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading } = useGetAllBlogsQuery({ page, limit: 10, search: searchTerm });
    const blogs = data?.data || [];

    const [deleteBlog] = useDeleteBlogMutation();
    const [toggleStatus] = useToggleBlogStatusMutation();

    const handleToggleStatus = async (id: string) => {
        try {
            const res = await toggleStatus(id) as TResponse;
            if (res?.data?.success) {
                toast.success(res.data.message || "Blog toggle successfully");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to toggle blog status!");
            console.log(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this blog post?")) {
            const res = await deleteBlog(id) as TResponse;
            if (res?.data?.success) {
                toast.success(res.data.message || "Blog deleted successfully");
            } else {
                toast.error(
                    Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                        ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                        : res?.error?.data?.message || "Something went wrong!"
                );
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-neutral">Blog Management</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage your articles, news and updates.</p>
                </div>
                <Link to="/admin/blogs/add" className="admin_primary_btn">
                    <Plus size={18} /> Add New Blog
                </Link>
            </div>


            {/* --- Search Bar --- */}
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by title or location..."
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

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/80">
                            <th>SL</th>
                            <th>Post Details</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? <TableSkeleton columns={4} /> : blogs?.map((blog: any, index: number) => (
                            <tr key={blog?._id} className="group hover:bg-slate-50/50 transition-all">
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                            {blog?.image ? (
                                                <img src={API_URL + blog?.image} className="w-full h-full object-cover" alt={blog?.slug} loading='lazy' />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={16} /></div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 text-sm line-clamp-1">{blog.title}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">/{blog.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleToggleStatus(blog?._id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${blog?.isActive ? 'bg-primary' : 'bg-slate-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${blog?.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </td>
                                <td>
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/admin/blogs/edit/${blog?._id}`} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all">
                                            <Edit size={16} />
                                        </Link>
                                        <button onClick={() => handleDelete(blog?._id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <Pagination
                currentPage={page}
                totalPages={data?.meta?.pages || 1}
                onPageChange={(p) => setPage(p)}
            />
        </div>
    );
}