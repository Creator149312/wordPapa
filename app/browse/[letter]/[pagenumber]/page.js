import React from "react";
import LinkPagination from "@app/browse/LinkPagination";
import FINALCLEANWORDS from "@app/browse/FINALCLEANWORDS";
import AdsUnit from "@components/AdsUnit";

export const revalidate = 2592000; // Cache for 30 days

export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  let pagenumber = params.pagenumber;
  // read route params
  let titleStr = `Letter ${L} Dictionary: Page ${pagenumber}`;
  const descriptionStr = `Browse letter ${L} Dictionary at WordPapa - Page ${pagenumber}`;
  return {
    title: titleStr,
    description: descriptionStr,
    alternates: {
      canonical: `/browse/${L}`,
    },
  };
}

function countSpacesAndHyphens(word) {
  const regex = /[\s-]/g;
  const matches = word.match(regex);
  return matches ? matches.length : 0;
}

async function getWords(l) {
  // const filePath = process.cwd() + "/app/browse/cleanwords.txt"; // Replace with the actual path to your file.
  const regexZero = /^[a-zA-Z0-9 -]+$/;
  const regex = /^[a-zA-Z]+$/; //to find words which contain characters or digits
  try {
    // const fileContent = await fs.readFile(filePath, "utf8");
    // const linksArray = fileContent.split("\n");

    if (l === "0") {
      return FINALCLEANWORDS.filter((word) => {
        if (!/[a-zA-Z]/.test(word.charAt(0))) {
          if (regexZero.test(word) && word.length > 1) {
            //checking if word is a word or compound words with maximum of two words.
            if (countSpacesAndHyphens(word) <= 0) return true;
            else return false;
          }
        }
      });
    } else {
      return FINALCLEANWORDS.filter((word) => {
        if (word.charAt(0) === l) {
          if (regex.test(word) && word.length > 1) {
            //checking if word is a word or compound words with maximum of two words.
            // if (countSpacesAndHyphens(word) <= 1) return true;
            // else return false;
            return true;
          } else {
            return false;
          }
        }
      });
    }
  } catch (error) {
    // here we'll not throw error instead we return empty array
    // throw new Error(`Error reading the file: ${error.message}`);

    return [];
  }
}

const Page = async ({ params }) => {
  let words = await getWords(params.letter);
  let pagenumber = params.pagenumber;
  const L = decodeURIComponent(params.letter);
  const displayTitle = L === "0" ? "Symbols & Numbers" : `Letter ${L.toUpperCase()}`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10 ml-2">
          <div className="h-12 w-2 bg-[#75c32c] rounded-full shadow-[0_0_15px_rgba(117,195,44,0.3)]" />
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-1">
              Dictionary Browse — Page {pagenumber}
            </h2>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              {displayTitle} <span className="text-[#75c32c]">Dictionary</span>
            </h1>
          </div>
        </div>

        {/* In-Content Ad — between header and word list */}
        <div className="rounded-2xl overflow-hidden mb-8">
          <AdsUnit slot="1177026196" variant="banner" />
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 md:p-10 shadow-sm shadow-gray-200/50 dark:shadow-none">
          <div className="mb-8">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Showing results for words starting with{" "}
              <strong className="text-gray-900 dark:text-white">
                "{L === "0" ? "#" : L.toUpperCase()}"
              </strong>
            </p>
          </div>

          <LinkPagination
            links={words}
            linksPerPage={300}
            pagenumber={parseInt(pagenumber)}
            letter={params.letter}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
