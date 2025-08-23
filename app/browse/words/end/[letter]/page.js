import ALLCLEANWORDS from "@app/browse/ALLCLEANWORDS";
import DataFilterDisplay from "@utils/DataFilterDisplay";

export const revalidate = 2592000; // ✅ Cache full page HTML for 24 hours

export async function generateMetadata({ params }) {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";

  const titleStr = `Words Ending with ${phraseSearch} ${L.toUpperCase()} in English`;
  const descriptionStr = `Browse all English words that end with ${phraseSearch} ${L} as a suffix`;

  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  const L = decodeURIComponent(params.letter);
  const phraseSearch = L.length > 1 ? "" : "Letter";
  const regex = /^[a-zA-Z0-9]+$/;

  const words = ALLCLEANWORDS.filter(
    (w) => w.length > 1 && w.endsWith(L) && regex.test(w)
  );

  const titleString = `Words Ending with ${phraseSearch} ${L.toUpperCase()} in English`;

  if (words.length === 0) {
    return (
      <div className="m-4 p-4 border border-red-400 rounded bg-red-50">
        <h1 className="text-2xl font-bold text-red-600">No Words Found</h1>
        <p className="mt-2 text-lg">
          Sorry, we couldn’t find any words ending with{" "}
          <strong>{L}</strong>. Try a different letter or check your input.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the complete list of {words.length} English words ending with{" "}
        {phraseSearch} <strong>{L}</strong> as a suffix.
      </p>

      <DataFilterDisplay words={words} />
    </>
  );
};

export default Page;
