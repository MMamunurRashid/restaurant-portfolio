export default function DashboardLayoutSkeleton() {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar Skeleton - Only visible on LG screens */}
            <div className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-6 space-y-8">
                <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Skeleton */}
                <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
                    <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse" />
                        <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                </header>

                {/* Content Skeleton */}
                <main className="flex-1 p-8 overflow-y-auto space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                        ))}
                    </div>

                    {/* Large Content Block */}
                    <div className="h-100 bg-white rounded-3xl border border-slate-100 animate-pulse p-8">
                        <div className="h-8 w-1/4 bg-slate-100 rounded mb-6 animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-12 w-full bg-slate-50 rounded-xl animate-pulse" />
                            <div className="h-12 w-full bg-slate-50 rounded-xl animate-pulse" />
                            <div className="h-12 w-full bg-slate-50 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};