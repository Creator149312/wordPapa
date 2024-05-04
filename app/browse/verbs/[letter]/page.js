import VERB from "@app/browse/VERBS";
import Link from "next/link";
import commonLinks from "@utils/commonLinks";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);

  const phraseSearch = L.length > 1 ? '' : 'Letter';
  // read route params
  titleStr = `Verbs Starting with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all verbs that begin with ${phraseSearch} ${L} to describe positive or negative actions of a noun.`;
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
  let words = VERB.filter(
    (adj) => adj.length > 1 && adj.startsWith(L) && regex.test(adj)
  );
  let titleString = `Verbs Starting with ${phraseSearch} ${L.toUpperCase()}`;

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the list of {words.length} verbs starting with {phraseSearch} {L} to describe postive or negative actions of a noun.
      </p>
       <DataFilterDisplay words={words} />
       <p className="mb-6 text-lg font-normal">
        All the action words that begin with <strong>{L}</strong> are sorted based on length for
        easy browsing. The list also contains some conjugations in different
        tenses (past, present, future) and moods (indicative, imperative,
        subjunctive).
      </p>
    </>
  );
};

export default Page;
