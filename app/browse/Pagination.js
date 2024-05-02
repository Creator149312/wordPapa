import React from 'react';

function Pagination({ currentPage, totalPages, letter }) {
  const renderPagination = () => {
    const pagination = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(
          <a
            key={i}
            href={`/browse/${letter}/${i}/`}
            className={i === currentPage ? 'active' : ''}
          >
            {i}
          </a>
        );
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + 4);

      if (startPage > 1) {
        pagination.push(
          <a key="prev" href={`/browse/${letter}/${(currentPage-1)}/`}>
            Prev
          </a>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        pagination.push(
          <a
            key={i}
            href={`/browse/${letter}/${i}/`}
            className={i === currentPage ? 'active' : ''}
          >
            {i}
          </a>
        );
      }

      if (endPage < totalPages) {
        pagination.push(
          <a key="next" href={`/browse/${letter}/${++currentPage}/`}>
            Next
          </a>
        );
      }
    }

    return pagination;
  };

  return <div className="flex justify-center gap-3 m-3 p-3 items-center">{renderPagination()}</div>;
}

export default Pagination;
