import ALLCLEANWORDS from "@app/browse/ALLCLEANWORDS";
import DataFilterDisplaybyStartingLetter from "@/utils/DataFilterDisplaybyStartingLetter";

export const revalidate = 2592000; // ✅ Cache full page HTML 

export async function generateMetadata({ params }) {
  const L = parseInt(decodeURIComponent(params.length), 10);

  const titleStr = `${L} Letter Words in English`;
  const descriptionStr = `Browse the list of all ${L} English words and filter them according to starting letters, ending letters, and containing letters.`;

  return {
    title: titleStr,
    description: descriptionStr,
  };
}

const Page = async ({ params }) => {
  const L = parseInt(params.length, 10);
  const regex = /^[a-zA-Z]+$/;

  const words = ALLCLEANWORDS.filter(
    (w) => w.length === L && regex.test(w)
  );

  const titleString = `${L} Letter Words in English`;

  if (words.length === 0) {
    return (
      <div className="m-4 p-4 border border-red-400 rounded bg-red-50">
        <h1 className="text-2xl font-bold text-red-600">No Words Found</h1>
        <p className="mt-2 text-lg">
          Sorry, we couldn’t find any {L}-letter words. Try a different length or check your input.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-3 text-4xl font-bold">{titleString}</h1>
      <p className="mb-6 text-lg font-normal">
        Explore the complete list of {L}-letter English words. Use the filter
        options to sort these words according to starting letters, ending
        letters, and containing letters.
      </p>

      <DataFilterDisplaybyStartingLetter words={words} />
    </>
  );
};

export default Page;
