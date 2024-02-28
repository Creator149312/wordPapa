import ADJECTIVE from "@app/browse/ADJECTIVE_WORDS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? '' : 'Letter';
  // read route params
  titleStr = `Adjective Words Ending with ${phraseSearch} ${L.toUpperCase()} `;
  const descriptionStr = `Browse all adjectives that end with ${phraseSearch} ${L} to perfectly describe nouns and objects`;
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
  let words = ADJECTIVE.filter((adj) => (adj.length > 1 && adj.endsWith(L) && regex.test(adj)));
  let titleString = `Adjective Words Ending with ${phraseSearch} ${L.toUpperCase()}`;

  return (
    <>
      <h1>{titleString}</h1>
      <p>
        Explore the list of {words.length} positive and negative adjective words
        ending with {phraseSearch} {L} to describe person, place or thing.
      </p>
      {/* {words.map((link, index) => (
        <div key={index} className="wordSpan">
          {customLink(link)}
        </div>
      ))} */}
      <DataFilterDisplay words={words} />
    </>
  );
};

export default Page;
