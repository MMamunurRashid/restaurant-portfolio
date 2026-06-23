import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, X, Save, Type, } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import { useAddTeamCategoryMutation, useDeleteTeamCategoryMutation, useGetAllTeamCategoryQuery, useUpdateTeamCategoryMutation } from '@/redux/features/teamCategory/teamCategoryApi';
import type { ITeamCategory } from '@/interface/teamCategoryInterface';

export default function TeamCategory() {
    const { data, isLoading } = useGetAllTeamCategoryQuery({});
    const [addTeamCategory, { isLoading: isCreating }] = useAddTeamCategoryMutation();
    const [updateTeamCategory, { isLoading: isUpdating }] = useUpdateTeamCategoryMutation();
    const [deleteTeamCategory] = useDeleteTeamCategoryMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ITeamCategory>();
    const categories = data?.data || [];

    const openModal = (type?: ITeamCategory) => {
        if (type) {
            setEditingId(type?._id);
            reset({ name: type?.name, order: type?.order, description: type?.description });
        } else {
            setEditingId(null);
            reset({ name: '', order: null as any, description: '' });
        }
        setIsModalOpen(true);
    };

    const onSubmit = async (formData: ITeamCategory) => {
        try {
            if (editingId) {
                const res = await updateTeamCategory({ id: editingId, data: { ...formData, order: Number(formData.order) } }) as TResponse;
                if (res?.data?.success) {
                    toast.success("Team Category updated!");
                } else {
                    toast.error(res?.error?.data?.message || "Update failed");
                    console.log(res);
                }
            } else {
                const res = await addTeamCategory({ ...formData, order: Number(formData.order) }) as TResponse;
                if (res?.data?.success) {
                    toast.success("Team Category added!");
                } else {
                    toast.error(res?.error?.data?.message || "Add failed");
                    console.log(res);
                }
            }
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure? This will affect category under this type.")) {
            await deleteTeamCategory(id) as TResponse;
            toast.success("Deleted successfully");
        }
    };

    return (
        <div className="space-y-3 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <Tag size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">Team Category</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage categories for your Team.</p>
                    </div>
                </div>
                <button onClick={() => openModal()} className="admin_primary_btn">
                    <Plus size={18} /> Add New Category
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/80">
                            <th>Category Name</th>
                            <th>Slug</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? <TableSkeleton columns={3} /> : categories?.map((category: ITeamCategory) => (
                            <tr key={category?._id} className="group hover:bg-slate-50/50 transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 font-bold text-slate-800 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        {category?.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                    /{category?.slug}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openModal(category)} className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-lg transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(category?._id)} className="p-2 hover:bg-destructive/10 text-slate-400 hover:text-destructive rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-bold text-slate-800">{editingId ? 'Update Category' : 'Add Category'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Type size={14} />Category Name</label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    placeholder="e.g. Web Development"
                                />
                                {errors.name && <p className="text-[10px] text-destructive font-bold">{errors.name.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Type size={14} />Category Order</label>
                                <input
                                    type="number"
                                    {...register("order", { required: "Order is required" })}
                                    placeholder="e.g. 1"
                                />
                                {errors.order && <p className="text-[10px] text-destructive font-bold">{errors.order.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Type size={14} />Category Description</label>
                                <textarea
                                    {...register("description", { required: "Description is required" })}
                                    placeholder="e.g. Web Development"
                                    rows={4}
                                ></textarea>
                                {errors.description && <p className="text-[10px] text-destructive font-bold">{errors.description.message as string}</p>}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="admin_primary_btn w-full py-4 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {isCreating || isUpdating ? 'Processing...' : (editingId ? 'Update Category' : 'Save Category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}