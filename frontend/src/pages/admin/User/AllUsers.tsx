import { useState } from 'react';
import { Plus, Edit, Trash2, Users, Mail, Circle } from 'lucide-react';
import { useGetAllUserQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '@/redux/features/user/userApi';
import toast from 'react-hot-toast';
import UserSidebar from './UserSidebar';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';

export default function AllUsers() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const { data: userData, isLoading: isUserLoading } = useGetAllUserQuery({});

    const [addUser, { isLoading: isAdding }] = useAddUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const users = userData?.data || [];

    const handleOpenSidebar = (user: any = null) => {
        setEditingUser(user);
        setIsSidebarOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        try {
            const res = editingUser
                ? await updateUser({ id: editingUser._id, data }).unwrap()
                : await addUser({ ...data, role: "admin" }).unwrap();

            if (res?.success) {
                toast.success(editingUser ? "User updated!" : "User created!");
                setIsSidebarOpen(false);
            } else {
                toast.error(res?.message || "Operation failed");
                console.log(res);

            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Operation failed");
            console.log(error);

        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await deleteUser(id).unwrap();

            if (res?.success) {
                toast.success("User deleted!");
            } else {
                toast.error(res?.message || "Deletion failed");
                console.log(res);
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Deletion failed");
            console.log(error);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/5 text-primary rounded-xl"><Users size={24} /></div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral">User Management</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage staff accounts and system access.</p>
                    </div>
                </div>
                <button onClick={() => handleOpenSidebar()} className="admin_primary_btn"><Plus size={18} /> Add Member</button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th>Member</th>
                            <th>Designation</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isUserLoading ? <TableSkeleton columns={5} /> : users?.map((user: any) => (
                            <tr key={user?._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                                            {user?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{user?.name}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} /> {user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral/90 font-medium">{user?.designation || 'N/A'}</td>
                                <td>
                                    <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-[11px] font-bold uppercase tracking-tight">
                                        {user?.role || 'No Role'}
                                    </span>
                                </td>
                                <td>
                                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${user?.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                                        <Circle size={8} fill="currentColor" /> {user?.status}
                                    </div>
                                </td>
                                <td>
                                    {
                                        user?.role !== 'superAdmin' && <div className="flex justify-end">
                                            <button onClick={() => handleOpenSidebar(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(user?._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users?.length === 0 && !isUserLoading && (
                    <div className="p-20 text-center text-slate-400 font-medium">No users found. Click "Add Member" to create one.</div>
                )}
            </div>

            <UserSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                editingUser={editingUser}
                onSubmit={handleFormSubmit}
                isLoading={isAdding || isUpdating}
            />
        </div>
    );
}