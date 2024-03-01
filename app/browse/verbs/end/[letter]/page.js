import VERB from "@app/browse/VERBS";
import DataFilterDisplay from "@utils/DataFilterDisplay";

let titleStr = "";
export async function generateMetadata({ params }, parent) {
  const L = decodeURIComponent(params.letter);

  const phraseSearch = L.length > 1 ? '' : 'Letter';
  // read route params
  titleStr = `Verbs Ending with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all verbs that end with ${phraseSearch} ${L} to describe positive or negative actions of a noun.`;
  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  let L = params.letter;

  const phraseSearch = L.length > 1 ? '' : 'Letter';
  const regex = /^[a-zA-Z0-9]+$/;
  let words = VERB.filter(
    (adj) => adj.length > 1 && adj.endsWith(L) && regex.test(adj)
  );
  let titleString = `Verbs Ending with ${phraseSearch} ${L.toUpperCase()}`;

  return (
    <>
      <h1>{titleString}</h1>
      <p>
        Explore the list of {words.length} verbs ending with {phraseSearch} {L} to describe postive or negative actions of a noun.
      </p>
       <DataFilterDisplay words={words} />
    </>
  );
};

export default Page;
