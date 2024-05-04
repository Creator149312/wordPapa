import NOUN from "@app/browse/NOUNS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);

  const phraseSearch = L.length > 1 ? "" : "Letter";
  // read route params
  titleStr = `Nouns Starting with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all nouns that begin with ${phraseSearch} ${L} to and see how they name a person, place or thing.`;
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

  const phraseSearch = L.length > 1 ? "" : "Letter";
  const regex = /^[a-zA-Z0-9]+$/;
  let words = NOUN.filter(
    (adj) => adj.length > 1 && adj.startsWith(L) && regex.test(adj)
  );
  let titleString = `Nouns Starting with ${phraseSearch} ${L.toUpperCase()}`;

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the list of {words.length} nouns starting with {phraseSearch}{" "}
        {L} and see how they represent names of person, place, thing or concept.
      </p>
      {/* {words.map((link, index) => (
        <div key={index} className="wordSpan">
          {customLink(link)}
        </div>
      ))} */}
      <DataFilterDisplay words={words} />
      <p className="mb-6 text-lg font-normal">
        <strong>Note:</strong> All nouns beginining with <strong>{L}</strong> are sorted based on
        length for easy browsing.
      </p>
      <p className="mb-6 text-lg font-normal">
        This list will help you brainstorm specific categories or discover more
        specific type of noun (e.g., common noun, proper noun, concrete noun,
        abstract noun) you might not have known before.
      </p>
    </>
  );
};

export default Page;
