import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Save, ArrowLeft, Type, AlignLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAddBlogMutation, useGetBlogByIdQuery, useUpdateBlogMutation } from '@/redux/features/blog/blogApi';
import FileUploadField from '@/utils/fileUploadField';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import { JODIT_CONFIG } from '@/config/joditConfig';
import JoditEditor from 'jodit-react';

export default function BlogForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const { data: blogData, isLoading: isFetching } = useGetBlogByIdQuery(id, { skip: !id });
    const [addBlog, { isLoading: isCreating }] = useAddBlogMutation();
    const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

    const { register, handleSubmit, watch, setValue, reset, control, formState: { errors } } = useForm();

    useEffect(() => {
        if (isEditMode && blogData?.data) {
            reset(blogData?.data);
        }
    }, [blogData, reset, isEditMode]);

    const onSubmit = async (data: any) => {
        const formData = new FormData();
        const blogInfo = {
            title: data.title,
            description: data.description
        };

        formData.append('data', JSON.stringify(blogInfo));
        if (data.image?.[0] instanceof File) {
            formData.append('image', data.image[0]);
        }

        try {
            const res = isEditMode
                ? await updateBlog({ id, data: formData }) as TResponse
                : await addBlog(formData) as TResponse;

            if (res.data?.success) {
                toast.success(isEditMode ? "Blog updated successfully!" : "Blog created successfully!");
                navigate('/admin/blogs/all');
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
        } catch (error: any) {
            toast.error(error?.data?.message || "something went wrong!");
            console.log(error);
        }
    };

    if (isFetching) return <div className="p-10 text-center font-bold animate-pulse">Loading Post...</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/admin/blogs/all" className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-neutral">{isEditMode ? 'Edit Blog' : 'Add Blog'}</h1>
                </div>
                <button type="submit" disabled={isCreating || isUpdating} className="admin_primary_btn min-w-35">
                    <Save size={18} /> {isEditMode ? 'Update Blog' : 'Publish Blog'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/60 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Type size={14} /> Blog Title</label>
                            <input type="text" {...register("title", { required: true })} placeholder="Enter catchy title..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><AlignLeft size={14} /> Description</label>
                            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <JoditEditor value={field.value} config={JODIT_CONFIG} onBlur={newContent => field.onChange(newContent)} />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/60 space-y-4">
                        <h3 className="font-bold text-sm text-neutral border-b pb-3">Featured Image</h3>
                        <FileUploadField name="image" watch={watch} register={register} errors={errors} setValue={setValue} maxSize={1} />
                    </div>
                </div>
            </div>
        </form>
    );
}