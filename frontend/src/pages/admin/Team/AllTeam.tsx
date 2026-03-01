import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Search, FilterX } from 'lucide-react';
import { API_URL } from '@/config';
import toast from 'react-hot-toast';
import { useDeleteTeamMutation, useGetAllTeamQuery } from '@/redux/features/team/teamApi';
import { useGetAllTeamCategoryQuery } from '@/redux/features/teamCategory/teamCategoryApi';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import type { ITeam } from '@/interface/teamInterface';
import type { ITeamCategory } from '@/interface/teamCategoryInterface';
import { useState } from 'react';
import Pagination from '@/components/shared/Pagination';

export default function AllTeam() {
    const [page, setPage] = useState(1);

    // --- New Filter States ---
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // Fetch Team with Filters
    const { data, isLoading } = useGetAllTeamQuery({
        page,
        limit: 10,
        search: searchTerm,
        category: categoryFilter
    });

    // Fetch Categories for Dropdown
    const { data: catData } = useGetAllTeamCategoryQuery({});
    const categories = catData?.data || [];
    const teamMembers = data?.data || [];

    const [deleteTeam] = useDeleteTeamMutation();

    // Reset Filters
    const handleReset = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setPage(1);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to remove this team member?")) {
            try {
                const res = await deleteTeam(id) as TResponse;
                if (res?.data?.success) {
                    toast.success(res.data.message || "Member deleted successfully");
                } else {
                    toast.error(
                        Array.isArray(res?.error?.data?.error) && res?.error?.data?.error.length > 0
                            ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""}`.trim()
                            : res?.error?.data?.message || "Something went wrong!"
                    );
                    console.log(res);
                }
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to delete team member");
                console.log(error);
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
                        <h1 className="text-xl font-bold text-neutral">Our Team</h1>
                        <p className="text-slate-500 text-xs mt-1">
                            Manage {data?.meta?.total || 0} active team members.
                        </p>
                    </div>
                </div>
                <Link to="/admin/about/team/add" className="admin_primary_btn">
                    <Plus size={16} /> Add Member
                </Link>
            </div>

            {/* --- Filter Bar --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="pl-10 w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <select
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Categories</option>
                    {categories?.map((cat: ITeamCategory) => (
                        <option key={cat?._id} value={cat?._id}>{cat?.name}</option>
                    ))}
                </select>

                <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                    <FilterX size={16} /> Reset Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Order</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Member</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Designation</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <TableSkeleton columns={5} />
                            ) : teamMembers.length > 0 ? (
                                teamMembers?.map((member: ITeam) => (
                                    <tr key={member?._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="p-4">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                {member?.order}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-50">
                                                    <img
                                                        src={`${API_URL}${member?.image}`}
                                                        alt={member?.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e: any) => e.target.src = 'https://ui-avatars.com/api/?name=' + member?.name}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-800 text-sm">{member?.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{member?.designation}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase whitespace-nowrap">
                                                {member?.category?.name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/about/team/edit/${member?._id}`} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all">
                                                    <Edit size={14} />
                                                </Link>
                                                <button onClick={() => handleDelete(member?._id)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-red-600 hover:border-red-600 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-400 text-sm italic">
                                        No team members found.
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