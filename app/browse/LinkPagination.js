"use client"
import React, { useState } from 'react';
import commonLinks from '@utils/commonLinks';
import Pagination from './Pagination';

function customLink(word){
  let wordwithoutQuotes = word.substring(1, word.length-1)
  let slug = commonLinks.definition + wordwithoutQuotes;
  return <a href={slug} target="_blank" rel="noopener noreferrer">{wordwithoutQuotes}</a>;
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
    <div>
      {currentLinks.map((link, index) => (
        <div key={index} className='wordSpan'>
          {customLink(link)}
        </div>
      ))}
      <Pagination currentPage={pagenumber} totalPages={totalPages} letter={letter}/>
    </div>
  );
}

export default LinkPagination;
