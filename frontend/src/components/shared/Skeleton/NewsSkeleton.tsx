export default function NewsSkeleton() {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-0 overflow-hidden animate-pulse">
            {/* Thumbnail Skeleton */}
            <div className="aspect-video bg-slate-200" />

            {/* Content Skeleton */}
            <div className="p-6">
                {/* Date Skeleton */}
                <div className="h-3 w-24 bg-slate-200 rounded mb-4" />

                {/* Title Skeletons */}
                <div className="h-5 bg-slate-200 rounded w-full mb-2" />
                <div className="h-5 bg-slate-200 rounded w-2/3 mb-6" />

                {/* Button Skeleton */}
                <div className="h-10 w-32 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}