import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (showEllipsisStart) {
      pages.push(1);
      pages.push('...');
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (showEllipsisEnd) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1 py-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-xs font-mono font-bold border border-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-[#F2F1EF] transition"
      >
        Prev
      </button>

      {getPageNumbers().map((page, idx) => (
        typeof page === 'number' ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={`px-2 py-1 text-xs font-mono font-bold border border-[#1A1A1A] transition ${
              currentPage === page
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F2F1EF]'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-1 text-xs font-mono text-[#555555]">...</span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-xs font-mono font-bold border border-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-[#F2F1EF] transition"
      >
        Next
      </button>

      <span className="text-[10px] font-mono text-[#555555] ml-2">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};
