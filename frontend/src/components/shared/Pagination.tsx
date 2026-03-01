import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 py-6">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}