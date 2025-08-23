import VERB from "@app/browse/VERBS";
import DataFilterDisplay from "@utils/DataFilterDisplay";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";

  const titleStr = `Verbs Ending with ${phraseSearch} ${L.toUpperCase()}`;
  const descriptionStr = `Browse all verbs that end with ${phraseSearch} ${L} to describe positive or negative actions of a noun.`;

  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const regex = /^[a-zA-Z0-9]+$/;

  const words = VERB.filter(
    (verb) => verb.length > 1 && verb.endsWith(L) && regex.test(verb)
  );

  const titleString = `Verbs Ending with ${phraseSearch} ${L.toUpperCase()}`;

  if (words.length === 0) {
    return (
      <div className="m-4 p-4 border border-red-400 rounded bg-red-50">
        <h1 className="text-2xl font-bold text-red-600">No Verbs Found</h1>
        <p className="mt-2 text-lg">
          Sorry, we couldn’t find any verbs ending with{" "}
          <strong>{L}</strong>. Try a different letter or check your input.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the list of {words.length} verbs ending with {phraseSearch}{" "}
        <strong>{L}</strong> to describe positive or negative actions of a noun.
      </p>

      <DataFilterDisplay words={words} />

      <p className="mb-6 text-lg font-normal">
        All the action words that end with <strong>{L}</strong> are sorted based
        on length for easy browsing. The list also contains some conjugations in
        different tenses (past, present, future) and moods (indicative,
        imperative, subjunctive).
      </p>
    </>
  );
};

export default Page;
