import ADJECTIVE from "../../ADJECTIVE_WORDS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";
  // read route params
  titleStr = `Adjective Words Starting with ${phraseSearch} ${L.toUpperCase()} `;
  const descriptionStr = `Browse all adjectives that begin with ${phraseSearch} ${L} to perfectly describe nouns and objects`;
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
  let words = ADJECTIVE.filter(
    (adj) => adj.length > 1 && adj.startsWith(L) && regex.test(adj)
  );
  let titleString = `Adjective Words Starting with ${phraseSearch} ${L.toUpperCase()}`;

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the list of {words.length} positive and negative adjective words
        starting with {phraseSearch} <strong>{L}</strong> to describe person, place or thing.
      </p>
      {/* {words.map((link, index) => (
        <div key={index} className="wordSpan">
          {customLink(link)}
        </div>
      ))} */}
      <DataFilterDisplay words={words} />
      <p className="mb-6 text-lg font-normal">
        With these wider range of adjectives beginining with <strong>{L}</strong> you'll be able
        to discover nuanced options related to your initial idea.
      </p>
      <p className="mb-6 text-lg font-normal">
        The list also contains some describing words that indicate the
        grammatical role (e.g., common adjective, proper adjective) of each
        adjective to help you find even more precise and contrasting words for
        your writing.
      </p>
    </>
  );
};

export default Page;
