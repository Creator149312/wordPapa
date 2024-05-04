"use client"
import React, { useState } from 'react';
import commonLinks from '@utils/commonLinks';
import Pagination from './Pagination';
import Link from 'next/link';

function customLink(word){
  let wordwithHyphens = word.toLowerCase().replace(/ /g, '-');
  let slug = commonLinks.definition + wordwithHyphens;
  
  return <Link href={slug} target="_blank" rel="noopener noreferrer">{word}</Link>;
}

function LinkPagination({ links, linksPerPage, pagenumber, letter }) {
  const [currentPage, setCurrentPage] = useState(pagenumber);
  const totalPages = links.length/ linksPerPage;
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(links.length / linksPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {currentLinks.map((link, index) => (
        <div key={index} className='text-lg p-2 m-2 rounded-sm inline-block bg-[#75c32c] text-center shadow-md cursor-pointer'>
          {customLink(link)}
        </div>
      ))}
      <Pagination currentPage={pagenumber} totalPages={totalPages} letter={letter}/>
    </>
  );
}

export default LinkPagination;
