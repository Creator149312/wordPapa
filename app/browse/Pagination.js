import React from 'react';

function Pagination({ currentPage, totalPages, letter }) {
  // Ensure we are working with numbers to avoid string concatenation bugs
  const current = Number(currentPage);
  const total = Math.ceil(totalPages);

  const renderPagination = () => {
    const pagination = [];
    const baseClass = "min-w-[40px] h-[40px] flex items-center justify-center rounded-xl font-bold transition-all duration-200 border-2 shadow-sm text-sm";
    const activeClass = "bg-[#75c32c] border-[#75c32c] text-white shadow-lg shadow-[#75c32c]/30 scale-110";
    const inactiveClass = "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#75c32c] hover:text-[#75c32c] hover:-translate-y-1";

    // Logic for showing page numbers
    let startPage, endPage;
    if (total <= 5) {
      startPage = 1;
      endPage = total;
    } else {
      startPage = Math.max(1, current - 2);
      endPage = Math.min(total, startPage + 4);
      if (endPage === total) startPage = Math.max(1, total - 4);
    }

    // Prev Button
    if (current > 1) {
      pagination.push(
        <a
          key="prev"
          href={`/browse/${letter}/${current - 1}`}
          className={`${baseClass} ${inactiveClass} px-4 w-auto`}
        >
          Prev
        </a>
      );
    }

    // Numbered Buttons
    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <a
          key={i}
          href={`/browse/${letter}/${i}`}
          className={`${baseClass} ${i === current ? activeClass : inactiveClass}`}
        >
          {i}
        </a>
      );
    }

    // Next Button
    if (current < total) {
      pagination.push(
        <a
          key="next"
          href={`/browse/${letter}/${current + 1}`}
          className={`${baseClass} ${inactiveClass} px-4 w-auto`}
        >
          Next
        </a>
      );
    }

    return pagination;
  };

  // Only render if there's more than one page
  if (total <= 1) return null;

  return (
    <nav className="flex flex-wrap justify-center gap-2 md:gap-3 m-6 p-4 items-center" aria-label="Pagination">
      {renderPagination()}
    </nav>
  );
}

export default Pagination;