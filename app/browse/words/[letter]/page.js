import ALLCLEANWORDS from "@app/browse/ALLCLEANWORDS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? '' : 'Letter';
  // read route params
  titleStr = `Words Starting with ${phraseSearch} ${L.toUpperCase()} in English `;
  const descriptionStr = `Browse all English words that begin with ${phraseSearch} ${L} as a prefix`;
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  function customLink(word) {
    let wordwithHyphens = word.toLowerCase().replace(/ /g, "-");
    let slug = commonLinks.definition + wordwithHyphens;


    return (
      <Link href={slug} target="_blank" rel="noopener noreferrer">
        {word}
      </Link>
    );
  }

  let L = params.letter;
  const phraseSearch = L.length > 1 ? '' : 'Letter';
  const regex = /^[a-zA-Z0-9]+$/;
  let words = ALLCLEANWORDS.filter((w) => (w.length > 1 && w.startsWith(L) && regex.test(w)));
  let titleString = `Words Starting with ${phraseSearch} ${L.toUpperCase()} in English`;

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the list of {words.length} English words
        starting with {phraseSearch} {L} as a prefix.
      </p>
      <DataFilterDisplay words={words} />
    </>
  );
};

export default Page;
