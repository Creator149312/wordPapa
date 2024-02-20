import NOUN from "@app/browse/NOUNS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);
  // read route params
  titleStr = `Nouns Starting with Letter ${L.toUpperCase()}`;
  const descriptionStr = `Browse all nouns that begin with the letter ${L} to and use them in naming person, place or thing.`;
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
  const regex = /^[a-zA-Z0-9]+$/;
  let words = NOUN.filter(
    (adj) => adj.length > 1 && adj.startsWith(L) && regex.test(adj)
  );
  let titleString = `Nouns Starting with Letter ${L.toUpperCase()}`;

  return (
    <>
      <h1>{titleString}</h1>
      <p>
        Explore the list of {words.length} nouns starting with letter {L} and
        use them in naming person, place or thing.
      </p>
      {words.map((link, index) => (
        <div key={index} className="wordSpan">
          {customLink(link)}
        </div>
      ))}
    </>
  );
};

export default Page;
