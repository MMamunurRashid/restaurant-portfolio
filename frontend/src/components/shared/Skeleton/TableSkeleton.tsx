

interface TableSkeletonProps {
    columns?: number;
    rows?: number;
}

export default function TableSkeleton({ columns = 4, rows = 8 }: TableSkeletonProps) {
    return (
        <>
            {[...Array(rows)].map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                    {[...Array(columns)].map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-5">
                            {/* Dynamic width for more natural feeling */}
                            <div
                                className={`h-7 bg-slate-100 rounded-md ${colIndex === 0 ? 'w-8' : colIndex === 1 ? 'w-48' : 'w-24'
                                    }`}
                            ></div>
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};
