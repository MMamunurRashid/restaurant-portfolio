import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, User, Briefcase, Hash } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FileUploadField from '@/utils/fileUploadField';
import { useAddTeamMutation, useGetTeamByIdQuery, useUpdateTeamMutation } from '@/redux/features/team/teamApi';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import { useGetAllTeamCategoryQuery } from '@/redux/features/teamCategory/teamCategoryApi';
import type { ITeamCategory } from '@/interface/teamCategoryInterface';

export default function TeamForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: memberData } = useGetTeamByIdQuery(id, { skip: !isEdit });
    const [addTeam, { isLoading: isAdding }] = useAddTeamMutation();
    const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<any>();

    const { data } = useGetAllTeamCategoryQuery({});
    const categories = data?.data || [];

    useEffect(() => {
        if (isEdit && memberData?.data) {
            reset(memberData.data);
        }
    }, [memberData, reset, isEdit]);

    const onSubmit = async (data: any) => {

        // check file size
        if (data.image?.[0] && data.image[0].size > 1 * 1024 * 1024) {
            return toast.error("Image size should be less than 1MB");
        }

        const formData = new FormData();
        const info = { name: data.name, designation: data.designation, order: Number(data.order), category: data.category };

        formData.append('data', JSON.stringify(info));
        if (data.image?.[0] instanceof File) {
            formData.append('image', data.image[0]);
        }

        try {
            if (isEdit) {
                const res = await updateTeam({ id, data: formData }) as TResponse;
                if (res?.data?.success) {
                    toast.success("Member updated successfully!");
                    navigate('/admin/about/team/all');
                } else {
                    toast.error(
                        Array.isArray(res?.error?.data?.error) &&
                            res?.error?.data?.error.length > 0
                            ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""
                                }`.trim()
                            : res?.error?.data?.message || "Something went wrong!"
                    );
                    console.log(res);
                }
            } else {
                const res = await addTeam(formData) as TResponse;
                if (res?.data?.success) {
                    toast.success("Member added successfully!");
                    navigate('/admin/about/team/all');
                } else {
                    toast.error(
                        Array.isArray(res?.error?.data?.error) &&
                            res?.error?.data?.error.length > 0
                            ? `${res?.error?.data?.error[0]?.path || ""} ${res?.error?.data?.error[0]?.message || ""
                                }`.trim()
                            : res?.error?.data?.message || "Something went wrong!"
                    );
                    console.log(res);
                }
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add member!");
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/admin/about/team/all" className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-primary transition-all"><ArrowLeft size={20} /></Link>
                    <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Member' : 'Add New Member'}</h1>
                </div>
                <button type="submit" disabled={isAdding || isUpdating} className="admin_primary_btn">
                    <Save size={18} /> {isEdit ? 'Update Member' : 'Save Member'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                        <FileUploadField label="Member Photo" name="image" watch={watch} register={register} errors={errors} setValue={setValue} required={!isEdit} maxSize={1} />
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><User size={14} />Full Name</label>
                            <input type="text" {...register("name", { required: "Name is required" })} placeholder="e.g. John Doe" />
                        </div>

                        <select {...register("category")}>
                            <option value="">Select Category</option>
                            {
                                categories?.map((category: ITeamCategory) => (
                                    <option key={category?._id} value={category?._id}>{category?.name}</option>
                                ))
                            }
                        </select>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Briefcase size={14} /> Designation</label>
                                <input type="text" {...register("designation", { required: "Required" })} placeholder="CEO / Manager" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Hash size={14} /> Order</label>
                                <input type="number" {...register("order")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}