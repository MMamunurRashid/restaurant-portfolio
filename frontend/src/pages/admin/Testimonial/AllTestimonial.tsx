import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, } from 'lucide-react';
import { API_URL } from '@/config';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import { useState } from 'react';
import Pagination from '@/components/shared/Pagination';
import { useDeleteTestimonialMutation, useGetAllTestimonialQuery } from '@/redux/features/testimonial/testimonialApi';
import type { ITestimonial } from '@/interface/testimonialInterface';

export default function AllTestimonial() {
    const [page, setPage] = useState(1);

    // Fetch Team with Filters
    const { data, isLoading } = useGetAllTestimonialQuery({
        page,
        limit: 10,
    });
    const testimonials = data?.data || [];

    const [deleteTestimonial] = useDeleteTestimonialMutation();

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this team testimonial?")) {
            try {
                const res = await deleteTestimonial(id) as TResponse;
                if (res?.data?.success) {
                    toast.success(res.data.message || "testimonial deleted successfully");
                } else {
                    toast.error(
                        Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                            ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                            : res?.error?.data?.message || "Something went wrong!"
                    );
                }
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to delete team testimonial");
            }
        }
    };

    return (
        <div className="space-y-3 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className='flex items-start gap-2'>
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Users size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">Testimonial</h1>
                    </div>
                </div>
                <Link to="/admin/setting/testimonial/add" className="admin_primary_btn">
                    <Plus size={16} /> Add Review
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th>SL</th>
                                <th>Reviewer</th>
                                <th className='w-[30%]'>Review</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <TableSkeleton columns={5} />
                            ) : testimonials?.length > 0 ? (
                                testimonials?.map((review: ITestimonial, i: number) => (
                                    <tr key={review?._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td>
                                            {i + 1}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50">
                                                    <img
                                                        src={`${API_URL}${review?.image}`}
                                                        alt={review?.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e: any) => e.target.src = 'https://ui-avatars.com/api/?name=' + review?.name}
                                                        loading='lazy'
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{review?.name}</p>
                                                    <p>{review?.designation}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-sm text-slate-600">{review?.review}</td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/setting/testimonial/edit/${review?._id}`} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all">
                                                    <Edit size={14} />
                                                </Link>
                                                <button onClick={() => handleDelete(review?._id)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-red-600 hover:border-red-600 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-400 text-sm italic">
                                        No testimonial found.
                                    </td>
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