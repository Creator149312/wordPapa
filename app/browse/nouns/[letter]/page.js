import NOUN from "@app/browse/NOUNS";
import DataFilterDisplay from "@utils/DataFilterDisplay";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";

  const titleStr = `Nouns Starting with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all nouns that begin with ${phraseSearch} ${L} and see how they name a person, place, thing, or concept.`;

  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const regex = /^[a-zA-Z0-9]+$/;

  const words = NOUN.filter(
    (noun) => noun.length > 1 && noun.startsWith(L) && regex.test(noun)
  );

  const titleString = `Nouns Starting with ${phraseSearch} ${L.toUpperCase()}`;

  if (words.length === 0) {
    return (
      <div className="m-4 p-4 border border-red-400 rounded bg-red-50">
        <h1 className="text-2xl font-bold text-red-600">No Nouns Found</h1>
        <p className="mt-2 text-lg">
          Sorry, we couldn’t find any nouns starting with{" "}
          <strong>{L}</strong>. Try a different letter or check your input.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the list of {words.length} nouns starting with {phraseSearch}{" "}
        <strong>{L}</strong> and see how they represent names of a person,
        place, thing, or concept.
      </p>

      <DataFilterDisplay words={words} />

      <p className="mb-6 text-lg font-normal">
        <strong>Note:</strong> All nouns beginning with <strong>{L}</strong> are
        sorted based on length for easy browsing.
      </p>
      <p className="mb-6 text-lg font-normal">
        This list will help you brainstorm specific categories or discover more
        specific types of nouns (e.g., common noun, proper noun, concrete noun,
        abstract noun) you might not have known before.
      </p>
    </>
  );
};

export default Page;
