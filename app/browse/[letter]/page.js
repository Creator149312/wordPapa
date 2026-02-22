import React from "react";
import LinkPagination from "../LinkPagination";
import { redirect } from "next/navigation";
import FINALCLEANWORDS from "../FINALCLEANWORDS";

// Helper functions logic remains the same
function countSpacesAndHyphens(word) {
  const regex = /[\s-]/g;
  const matches = word.match(regex);
  return matches ? matches.length : 0;
}

function checkLengthandLetter(l) {
  return (
    l.length === 1 &&
    (l === "0" || (l.charCodeAt(0) >= 97 && l.charCodeAt(0) <= 122))
  );
}

export async function generateMetadata({ params }) {
  const L = decodeURIComponent(params.letter);
  if (checkLengthandLetter(L)) {
    const titleStr = `Letter ${L.toUpperCase()} Dictionary`;
    return {
      title: titleStr,
      description: `Browse letter ${L} Dictionary at WordPapa`,
    };
  }
}

async function getWords(l) {
  const regexZero = /^[a-zA-Z0-9 -]+$/;
  const regex = /^[a-zA-Z]+$/;
  try {
    if (l === "0") {
      return FINALCLEANWORDS.filter((word) => {
        if (!/[a-zA-Z]/.test(word.charAt(0))) {
          if (regexZero.test(word) && word.length > 1) {
            return countSpacesAndHyphens(word) <= 0;
          }
        }
        return false;
      });
    } else {
      return FINALCLEANWORDS.filter((word) => {
        if (word.charAt(0).toLowerCase() === l.toLowerCase()) {
          return regex.test(word) && word.length > 1;
        }
        return false;
      });
    }
  } catch (error) {
    return [];
  }
}

const Page = async ({ params }) => {
  const { letter, pagenumber = 1 } = params;

  if (!checkLengthandLetter(letter)) {
    redirect("/browse");
  }

  const words = await getWords(letter);
  const L = decodeURIComponent(letter);
  const displayTitle = L === "0" ? "Symbols & Numbers" : `Letter ${L.toUpperCase()}`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section with the Green Theme Accent */}
        <div className="flex items-center gap-4 mb-10 ml-2">
          <div className="h-12 w-2 bg-[#75c32c] rounded-full shadow-[0_0_15px_rgba(117,195,44,0.3)]" />
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-1">
              Dictionary Browse
            </h2>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              {displayTitle} <span className="text-[#75c32c]">Dictionary</span>
            </h1>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 md:p-10 shadow-sm shadow-gray-200/50 dark:shadow-none">
          <div className="mb-8">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Showing results for words starting with <strong className="text-gray-900 dark:text-white">"{L === "0" ? "#" : L.toUpperCase()}"</strong>
            </p>
          </div>

          <LinkPagination
            links={words}
            linksPerPage={300}
            pagenumber={parseInt(pagenumber)}
            letter={letter}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;