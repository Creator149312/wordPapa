import ADJECTIVE from "../../ADJECTIVE_WORDS";
import DataFilterDisplay from "@utils/DataFilterDisplay";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";

  const titleStr = `Adjective Words Starting with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all adjectives that begin with ${phraseSearch} ${L} to perfectly describe nouns and objects`;

  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const regex = /^[a-zA-Z0-9]+$/;

  const words = ADJECTIVE.filter(
    (adj) => adj.length > 1 && adj.startsWith(L) && regex.test(adj)
  );

  const titleString = `Adjective Words Starting with ${phraseSearch} ${L.toUpperCase()}`;

  if (words.length === 0) {
    return (
      <div className="m-4 p-4 border border-red-400 rounded bg-red-50">
        <h1 className="text-2xl font-bold text-red-600">No Adjectives Found</h1>
        <p className="mt-2 text-lg">
          Sorry, we couldn’t find any adjectives starting with{" "}
          <strong>{L}</strong>. Try a different letter or check your input.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the list of {words.length} positive and negative adjective words
        starting with {phraseSearch} <strong>{L}</strong> to describe a person,
        place, or thing.
      </p>

      <DataFilterDisplay words={words} />

      <p className="mb-6 text-lg font-normal">
        With this wide range of adjectives beginning with <strong>{L}</strong>,
        you'll be able to discover nuanced options related to your initial idea.
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
