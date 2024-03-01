import NOUN from "@app/browse/NOUNS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);

  const phraseSearch = L.length > 1 ? '' : 'Letter';
  // read route params
  titleStr = `Nouns Ending with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all singular and plural nouns that end with ${phraseSearch} ${L} to and see how they name a person, place or thing.`;
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
  let words = NOUN.filter(
    (adj) => adj.length > 1 && adj.endsWith(L) && regex.test(adj)
  );
  let titleString = `Nouns Ending with ${phraseSearch} ${L.toUpperCase()}`;

  return (
    <>
      <h1>{titleString}</h1>
      <p>
        Explore the list of {words.length} singular and plural nouns ending with {phraseSearch} {L} and
        see how they represent names of person, place, thing or concept.
      </p>
       <DataFilterDisplay words={words} />
    </>
  );
};

export default Page;
