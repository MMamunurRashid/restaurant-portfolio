import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Camera } from 'lucide-react';
import FileUploadField from '@/utils/fileUploadField';
import toast from 'react-hot-toast';
import type { TResponse } from '@/interface/globalInterface';
import { useAppSelector } from '@/redux/hook/hooks';
import { useGetUserByIdQuery, useUpdateProfileMutation } from '@/redux/features/user/userApi';

export default function MyProfile() {
    const { loggedUser } = useAppSelector((state) => state.auth);
    const userId = loggedUser?._id || '';

    const { data: userData, isLoading: isFetching } = useGetUserByIdQuery(userId);

    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

    // Forms
    const profileForm = useForm<any>();

    // Load Profile Data
    useEffect(() => {
        if (userData?.data) {
            profileForm.reset({
                name: userData?.data?.name,
                email: userData?.data?.email,
                profileUrl: userData?.data?.profileUrl
            });
        }
    }, [userData, profileForm]);

    // Handle Profile Update
    const onProfileSubmit = async (data: any) => {
        const formData = new FormData();
        const info = {
            name: data.name,
            designation: data.designation
        };

        formData.append('data', JSON.stringify(info));
        if (data.profileUrl?.[0] instanceof File) {
            formData.append('image', data.profileUrl[0]);
        }

        try {
            const res = await updateProfile({ id: userId, data: formData }) as TResponse;
            if (res?.data?.success) {
                toast.success("Profile updated successfully!");
            } else {
                toast.error(res?.error?.data?.message || "Failed to update profile");
                console.log(res);

            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile!");
            console.log(error);
        }
    };


    if (isFetching) return <div className="p-10 text-center font-medium animate-pulse">Loading Profile...</div>;

    return (
        <div className="space-y-3 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <User size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-neutral">Account Settings</h1>
                    <p className="text-slate-500 text-xs mt-1">Update your personal information and security preferences.</p>
                </div>
            </div>

            {/* Left: Profile Edit */}
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="lg:col-span-7 space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-8">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b border-slate-50 pb-4">
                        <Camera size={18} className="text-primary" /> Profile Information
                    </h3>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-52">
                            <FileUploadField
                                label="Photo"
                                name="profileUrl"
                                watch={profileForm.watch}
                                register={profileForm.register}
                                errors={profileForm.formState.errors}
                                setValue={profileForm.setValue}
                                maxSize={1}
                            />
                        </div>

                        <div className="flex-1 w-full space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><User size={14} /> Full Name</label>
                                <input type="text" {...profileForm.register("name", { required: true })} placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><Mail size={14} /> Email Address (Read-only)</label>
                                <input type="email" {...profileForm.register("email")} disabled className="bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200" />
                            </div>
                            <button type="submit" disabled={isUpdatingProfile} className="admin_primary_btn w-full md:w-auto mt-2">
                                {isUpdatingProfile ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    );
}