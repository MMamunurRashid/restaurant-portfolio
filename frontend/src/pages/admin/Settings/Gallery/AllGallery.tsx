import { Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import TableSkeleton from '@/components/shared/Skeleton/TableSkeleton';
import { CONFIG } from '@/config';
import { useState } from 'react';
import Pagination from '@/components/shared/Pagination';
import type { IGallery } from '@/interface/galleryInterface';
import { useDeleteGalleryMutation, useGetAllGalleryQuery } from '@/redux/features/gallery/galleryApi';

export default function AllGallery() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useGetAllGalleryQuery({ page, limit: 10, search: searchTerm });

  const galleries = data?.data || [];

  const [deleteGallery] = useDeleteGalleryMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this gallery permanently?')) return;
    const res = (await deleteGallery(id)) as TResponse;
    if (res?.data?.success) toast.success(res.data.message || 'Gallery deleted');
    else toast.error(res?.error?.data?.message || 'Something went wrong');
  };

  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-neutral">Galleries</h1>
          <p className="text-slate-500 text-xs mt-1">Manage {data?.meta?.total || 0} galleries.</p>
        </div>
        <Link to="/admin/setting/gallery/add" className="admin_primary_btn">
          <Plus size={18} /> Add New Gallery
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="relative">
          <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-3 w-full" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="p-4">Gallery</th>
                <th className="p-4">Images</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? <TableSkeleton columns={4} /> : galleries?.length > 0 ? galleries?.map((item: IGallery & { _id?: string }) => (
                <tr key={(item as any)?._id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={CONFIG.BASE_URL + (item?.images?.[0]?.image || '')} className="w-24 h-16 rounded-lg object-cover border border-slate-200" alt="gallery" loading='lazy' />
                      <div>
                        <p className="font-bold text-neutral text-sm line-clamp-1">{item?.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{item?.images?.length || 0}</td>
                  <td className="p-4">{item?.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <Link to={`/admin/setting/gallery/edit/${(item as any)?._id}`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete((item as any)?._id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400 text-sm">No galleries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={data?.meta?.pages || 1} onPageChange={(p) => setPage(p)} />
    </div>
  );
}
