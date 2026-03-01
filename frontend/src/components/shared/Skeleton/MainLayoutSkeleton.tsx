export default function MainLayoutSkeleton() {
    return (
        <div className="min-h-screen bg-[#FCFCFC] overflow-hidden">
            {/* 1. Global Navigation Skeleton */}
            <nav className="fixed top-0 left-0 right-0 z-60 h-20 bg-white/50 backdrop-blur-md border-b border-slate-100/50 px-6 lg:px-16 flex items-center justify-between">
                <div className="h-8 w-32 bg-slate-200/60 rounded-xl animate-pulse" />

                <div className="hidden lg:flex items-center gap-10">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-3 w-16 bg-slate-200/50 rounded-full animate-pulse" />
                    ))}
                </div>

                <div className="h-11 w-36 bg-slate-200/80 rounded-full animate-pulse shadow-sm" />
            </nav>

            {/* 2. Main Content Area */}
            <main className="pt-32 pb-20 max-w-360 mx-auto px-6 lg:px-16 space-y-24">

                {/* Dynamic Hero/Header Skeleton */}
                <div className="space-y-8 max-w-4xl">
                    <div className="space-y-4">
                        <div className="h-3 w-32 bg-primary/10 rounded-full animate-pulse" />
                        <div className="h-16 md:h-24 w-full md:w-3/4 bg-slate-200/60 rounded-4xl animate-pulse" />
                        <div className="h-16 md:h-24 w-1/2 bg-slate-100/60 rounded-4xl animate-pulse hidden md:block" />
                    </div>
                    <div className="h-4 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
                </div>

                {/* Flexible Grid System (Adapts to Blogs/Services/Teams) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="group space-y-6">
                            {/* Visual Asset Container */}
                            <div className="aspect-4/5 w-full bg-slate-200/40 rounded-[2.5rem] animate-pulse relative overflow-hidden">
                                {/* Subtle Shine Effect */}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4 px-2">
                                <div className="flex gap-3">
                                    <div className="h-3 w-12 bg-slate-200/60 rounded-full animate-pulse" />
                                    <div className="h-3 w-12 bg-slate-100/60 rounded-full animate-pulse" />
                                </div>
                                <div className="h-8 w-full bg-slate-200/70 rounded-2xl animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-slate-100/80 rounded-full animate-pulse" />
                                    <div className="h-3 w-2/3 bg-slate-100/80 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Subtle Gradient Decor (Matches Premium Vibe) */}
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10 animate-pulse" />
            <div className="fixed top-0 left-0 w-72 h-72 bg-slate-200/20 blur-[100px] -z-10" />
        </div>
    );
}