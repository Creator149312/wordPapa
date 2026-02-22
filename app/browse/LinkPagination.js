"use client"
import React, { useState } from 'react';
import commonLinks from '@utils/commonLinks';
import Pagination from './Pagination';
import Link from 'next/link';

function CustomLink({ word }) {
  const wordWithHyphens = word.toLowerCase().replace(/ /g, '-');
  const slug = commonLinks.definition + wordWithHyphens;
  
  return (
    <Link 
      href={slug} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200 group-hover:text-[#75c32c]"
    >
      {word}
    </Link>
  );
}

function LinkPagination({ links, linksPerPage, pagenumber, letter }) {
  const [currentPage, setCurrentPage] = useState(pagenumber);
  
  const totalPages = Math.ceil(links.length / linksPerPage);
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);

  return (
    <div className="w-full">
      {/* Words Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-12">
        {currentLinks.map((link, index) => (
          <div 
            key={index} 
            className="group relative bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:border-[#75c32c] hover:shadow-lg hover:shadow-[#75c32c]/10 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            <CustomLink word={link} />
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center">
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          letter={letter} 
          // Note: Ensure your Pagination component also uses the #75c32c theme
        />
      </div>
    </div>
  );
}

export default LinkPagination;